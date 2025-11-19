import axios from 'axios';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  timestamp: number;
  source?: 'microphone' | 'system-audio' | 'ambient' | 'file';
}

interface VoiceNote {
  id: string;
  timestamp: number;
  text: string;
  language: string;
  summary?: string;
  source: 'microphone' | 'system-audio' | 'ambient';
}

let globalVoiceNotesManager: VoiceNotesManager | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('VoiceNotes AI extension is now active! 🎤');

  const voiceNotesManager = new VoiceNotesManager(context);
  globalVoiceNotesManager = voiceNotesManager;

  // Register commands
  const commands = [
    vscode.commands.registerCommand('voicenotesai.startListening', () =>
      voiceNotesManager.startListening()
    ),
    vscode.commands.registerCommand('voicenotesai.stopListening', () =>
      voiceNotesManager.stopListening()
    ),
    vscode.commands.registerCommand('voicenotesai.openPanel', () => voiceNotesManager.openPanel()),
    vscode.commands.registerCommand('voicenotesai.transcribeAudioFile', () =>
      voiceNotesManager.transcribeAudioFile()
    ),
    vscode.commands.registerCommand('voicenotesai.generateSummary', () =>
      voiceNotesManager.generateSummary()
    ),
    vscode.commands.registerCommand('voicenotesai.toggleAmbientListening', () =>
      voiceNotesManager.toggleAmbientListening()
    ),
  ];

  commands.forEach((cmd) => context.subscriptions.push(cmd));

  // Create webview panel provider
  const provider = new VoiceNotesWebviewProvider(context.extensionUri, voiceNotesManager);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('voiceNotesPanel', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // Initialize audio service
  voiceNotesManager.initializeAudioService();

  // Show welcome message
  vscode.window
    .showInformationMessage(
      '🎤 VoiceNotes AI is ready! Use Ctrl+Shift+V to start recording.',
      'Open Panel'
    )
    .then((selection) => {
      if (selection === 'Open Panel') {
        voiceNotesManager.openPanel();
      }
    });
}

class VoiceNotesManager {
  private isListening = false;
  private ambientListening = false;
  private audioService: ChildProcess | null = null;
  private currentTranscription = '';
  private voiceNotes: VoiceNote[] = [];
  private webviewView: vscode.WebviewView | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.loadVoiceNotes();
  }

  async initializeAudioService() {
    // Create Python audio service
    const audioServicePath = path.join(this.context.extensionPath, 'audio_service.py');

    if (!fs.existsSync(audioServicePath)) {
      await this.createAudioService(audioServicePath);
    }

    // Download Whisper model if needed
    await this.ensureWhisperModel();

    // Download Ollama model if needed
    await this.ensureOllamaModel();
  }

  private async createAudioService(audioServicePath: string) {
    const audioServiceCode = `#!/usr/bin/env python3
"""
VoiceNotes AI Audio Service
Handles real-time audio capture and transcription using Whisper
"""

import whisper
import sounddevice as sd
import numpy as np
import json
import sys
import threading
import queue
import time
import tempfile
import os
from pathlib import Path

class AudioTranscriber:
    def __init__(self, model_size="base", sample_rate=16000):
        print(f"Loading Whisper model: {model_size}", file=sys.stderr)
        self.model = whisper.load_model(model_size)
        self.sample_rate = sample_rate
        self.audio_queue = queue.Queue()
        self.is_recording = False
        self.ambient_mode = False
        
    def start_recording(self, source="microphone"):
        """Start recording from microphone or system audio"""
        if self.is_recording:
            return {"error": "Already recording"}
            
        self.is_recording = True
        self.source = source
        
        # Start audio capture thread
        self.audio_thread = threading.Thread(target=self._capture_audio)
        self.audio_thread.daemon = True
        self.audio_thread.start()
        
        return {"status": "recording_started", "source": source}
    
    def stop_recording(self):
        """Stop recording and return transcription"""
        if not self.is_recording:
            return {"error": "Not currently recording"}
            
        self.is_recording = False
        
        # Wait for thread to finish and get audio data
        if hasattr(self, 'audio_thread'):
            self.audio_thread.join(timeout=2)
        
        # Process accumulated audio
        return self._process_audio_queue()
    
    def toggle_ambient_listening(self):
        """Toggle ambient listening mode"""
        self.ambient_mode = not self.ambient_mode
        
        if self.ambient_mode:
            return self.start_recording("ambient")
        else:
            return self.stop_recording()
    
    def _capture_audio(self):
        """Capture audio in chunks"""
        chunk_duration = 2  # seconds
        chunk_samples = int(self.sample_rate * chunk_duration)
        
        def audio_callback(indata, frames, time, status):
            if status:
                print(f"Audio status: {status}", file=sys.stderr)
            if self.is_recording:
                # Add audio chunk to queue
                self.audio_queue.put(indata.copy())
        
        try:
            with sd.InputStream(
                samplerate=self.sample_rate,
                channels=1,
                callback=audio_callback,
                blocksize=chunk_samples
            ):
                print(f"🎤 Recording started - {self.source}", file=sys.stderr)
                while self.is_recording:
                    time.sleep(0.1)
                    
                    # In ambient mode, process chunks continuously
                    if self.ambient_mode and not self.audio_queue.empty():
                        result = self._process_audio_queue(continuous=True)
                        if result.get("text"):
                            print(json.dumps(result))
                            sys.stdout.flush()
                            
        except Exception as e:
            print(f"Audio capture error: {e}", file=sys.stderr)
    
    def _process_audio_queue(self, continuous=False):
        """Process audio queue and return transcription"""
        if self.audio_queue.empty():
            return {"text": "", "language": "unknown"}
        
        # Combine audio chunks
        audio_chunks = []
        while not self.audio_queue.empty():
            try:
                chunk = self.audio_queue.get_nowait()
                audio_chunks.append(chunk)
            except queue.Empty:
                break
        
        if not audio_chunks:
            return {"text": "", "language": "unknown"}
        
        # Concatenate audio
        audio_data = np.concatenate(audio_chunks, axis=0)
        audio_data = audio_data.flatten().astype(np.float32)
        
        # Skip if audio is too short or too quiet
        if len(audio_data) < self.sample_rate * 0.5:  # Less than 0.5 seconds
            return {"text": "", "language": "unknown"}
        
        if np.max(np.abs(audio_data)) < 0.01:  # Too quiet
            return {"text": "", "language": "unknown"}
        
        try:
            # Transcribe with Whisper
            result = self.model.transcribe(
                audio_data,
                language=None,  # Auto-detect
                word_timestamps=True
            )
            
            return {
                "text": result["text"].strip(),
                "language": result["language"],
                "confidence": 1.0,  # Whisper doesn't provide confidence
                "timestamp": int(time.time() * 1000),
                "source": self.source
            }
            
        except Exception as e:
            print(f"Transcription error: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def transcribe_file(self, file_path):
        """Transcribe an audio file"""
        try:
            result = self.model.transcribe(file_path, language=None)
            return {
                "text": result["text"].strip(),
                "language": result["language"],
                "confidence": 1.0,
                "timestamp": int(time.time() * 1000),
                "source": "file"
            }
        except Exception as e:
            return {"error": str(e)}

def main():
    transcriber = AudioTranscriber()
    
    print("VoiceNotes AI Audio Service Ready", file=sys.stderr)
    
    try:
        while True:
            line = sys.stdin.readline()
            if not line:
                break
                
            try:
                command = json.loads(line.strip())
                action = command.get("action")
                
                if action == "start_recording":
                    source = command.get("source", "microphone")
                    result = transcriber.start_recording(source)
                elif action == "stop_recording":
                    result = transcriber.stop_recording()
                elif action == "toggle_ambient":
                    result = transcriber.toggle_ambient_listening()
                elif action == "transcribe_file":
                    file_path = command.get("file_path")
                    result = transcriber.transcribe_file(file_path)
                else:
                    result = {"error": f"Unknown action: {action}"}
                
                print(json.dumps(result))
                sys.stdout.flush()
                
            except json.JSONDecodeError:
                print(json.dumps({"error": "Invalid JSON command"}))
                sys.stdout.flush()
            except Exception as e:
                print(json.dumps({"error": str(e)}))
                sys.stdout.flush()
                
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Service error: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
`;

    fs.writeFileSync(audioServicePath, audioServiceCode);
    fs.chmodSync(audioServicePath, '755');
  }

  private async ensureWhisperModel() {
    const config = vscode.workspace.getConfiguration('voicenotesai');
    const modelSize = config.get<string>('whisperModel', 'base');

    vscode.window.showInformationMessage(
      `🔄 Downloading Whisper ${modelSize} model (first time only)...`
    );

    // Test Whisper installation
    try {
      const testProcess = spawn('python3', ['-c', 'import whisper; whisper.load_model("tiny")']);
      await new Promise((resolve, reject) => {
        testProcess.on('close', (code) => {
          if (code === 0) resolve(code);
          else reject(new Error(`Whisper test failed with code ${code}`));
        });
      });
    } catch (error) {
      vscode.window.showErrorMessage(
        '❌ Whisper not properly installed. Please run: pip3 install --user openai-whisper'
      );
    }
  }

  private async ensureOllamaModel() {
    const config = vscode.workspace.getConfiguration('voicenotesai');
    const modelName = config.get<string>('ollamaModel', 'llama3.2');

    try {
      // Check if Ollama model exists
      const result = await axios.get('http://localhost:11434/api/tags');
      const models = result.data.models || [];

      if (!models.some((m: any) => m.name.includes(modelName))) {
        vscode.window
          .showInformationMessage(`🔄 Downloading Ollama ${modelName} model...`, 'Continue')
          .then(() => {
            // Download model in background
            spawn('ollama', ['pull', modelName], { detached: true });
          });
      }
    } catch (error) {
      console.log('Ollama not running or not installed');
    }
  }

  async startListening() {
    if (this.isListening) {
      vscode.window.showWarningMessage('Already listening!');
      return;
    }

    const config = vscode.workspace.getConfiguration('voicenotesai');
    const captureSystemAudio = config.get<boolean>('captureSystemAudio', true);

    const source = captureSystemAudio ? 'system-audio' : 'microphone';

    try {
      await this.sendAudioCommand({ action: 'start_recording', source });
      this.isListening = true;

      vscode.window
        .showInformationMessage(`🎤 Recording started (${source})...`, 'Stop Recording')
        .then((selection) => {
          if (selection === 'Stop Recording') {
            this.stopListening();
          }
        });

      this.updateWebview();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to start recording: ${error}`);
    }
  }

  async stopListening() {
    if (!this.isListening) {
      vscode.window.showWarningMessage('Not currently listening!');
      return;
    }

    // Set state to false immediately to prevent multiple stops
    this.isListening = false;
    this.updateWebview();

    try {
      vscode.window.showInformationMessage('⏹️ Stopping recording and processing...');

      const result = await this.sendAudioCommand({ action: 'stop_recording' });

      console.log('Stop recording result:', result);

      if (result.error) {
        vscode.window.showErrorMessage(`Recording error: ${result.error}`);
        return;
      }

      if (result.text && result.text.trim()) {
        await this.processTranscription(result);
        vscode.window
          .showInformationMessage(
            `✅ Transcribed: "${result.text.substring(0, 50)}..."`,
            'View Full Text',
            'Generate Summary'
          )
          .then((selection) => {
            if (selection === 'View Full Text') {
              this.openPanel();
            } else if (selection === 'Generate Summary') {
              this.generateSummary();
            }
          });
      } else {
        vscode.window.showWarningMessage('No speech detected in recording.');
      }

      this.updateWebview();
    } catch (error) {
      console.error('Stop listening error:', error);
      vscode.window.showErrorMessage(`Failed to stop recording: ${error}`);

      // Force kill audio service if it's stuck
      if (this.audioService && !this.audioService.killed) {
        this.audioService.kill('SIGTERM');
        this.audioService = null;
      }

      this.updateWebview();
    }
  }

  async toggleAmbientListening() {
    try {
      const result = await this.sendAudioCommand({ action: 'toggle_ambient' });
      this.ambientListening = !this.ambientListening;

      const message = this.ambientListening
        ? '🌍 Ambient listening enabled - capturing all conversations'
        : '⏹️ Ambient listening disabled';

      vscode.window.showInformationMessage(message);
      this.updateWebview();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to toggle ambient listening: ${error}`);
    }
  }

  async transcribeAudioFile() {
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        'Audio Files': ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'mp4'],
      },
    });

    if (fileUri && fileUri[0]) {
      const filePath = fileUri[0].fsPath;

      try {
        vscode.window.showInformationMessage('🔄 Transcribing audio file...');
        const result = await this.sendAudioCommand({
          action: 'transcribe_file',
          file_path: filePath,
        });

        if (result.text) {
          await this.processTranscription({
            ...result,
            source: 'file',
          });
          vscode.window.showInformationMessage('✅ Audio file transcribed successfully!');
          this.openPanel();
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to transcribe file: ${error}`);
      }
    }
  }

  async generateSummary() {
    if (this.voiceNotes.length === 0) {
      vscode.window.showWarningMessage('No voice notes to summarize!');
      return;
    }

    const latestNote = this.voiceNotes[this.voiceNotes.length - 1];

    try {
      const config = vscode.workspace.getConfiguration('voicenotesai');
      const modelName = config.get<string>('ollamaModel', 'llama3.2');

      const prompt = `Please provide a concise summary of this transcribed conversation/content. Include key points, action items, and important details:

${latestNote.text}`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: modelName,
        prompt: prompt,
        stream: false,
      });

      const summary = response.data.response;
      latestNote.summary = summary;

      this.saveVoiceNotes();
      this.updateWebview();

      vscode.window.showInformationMessage('✨ AI summary generated!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate summary: ${error}`);
    }
  }

  openPanel() {
    vscode.commands.executeCommand('voiceNotesPanel.focus');
  }

  private async processTranscription(result: TranscriptionResult) {
    const voiceNote: VoiceNote = {
      id: Date.now().toString(),
      timestamp: result.timestamp || Date.now(),
      text: result.text,
      language: result.language || 'unknown',
      source: (result.source as any) || 'microphone',
    };

    this.voiceNotes.push(voiceNote);
    this.saveVoiceNotes();

    // Auto-generate summary if enabled
    const config = vscode.workspace.getConfiguration('voicenotesai');
    if (config.get<boolean>('autoSummarize', true)) {
      setTimeout(() => this.generateSummary(), 1000);
    }

    this.updateWebview();
  }

  private currentCommandResolvers: Array<{ resolve: Function; reject: Function }> = [];

  private async sendAudioCommand(command: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Remove this resolver from the list
        const index = this.currentCommandResolvers.findIndex((r) => r.resolve === resolve);
        if (index >= 0) {
          this.currentCommandResolvers.splice(index, 1);
        }
        reject(new Error('Audio service timeout'));
      }, 30000); // 30 second timeout

      // Add this resolver to the queue
      this.currentCommandResolvers.push({ resolve, reject });

      if (!this.audioService || this.audioService.killed) {
        // Start audio service
        const audioServicePath = path.join(this.context.extensionPath, 'audio_service.py');
        console.log('Starting audio service:', audioServicePath);
        this.audioService = spawn('python3', [audioServicePath]);

        this.audioService.stdout?.on('data', (data) => {
          try {
            const lines = data
              .toString()
              .split('\n')
              .filter((line: string) => line.trim());

            for (const line of lines) {
              try {
                const result = JSON.parse(line);
                console.log('Audio service JSON response:', result);

                // Resolve the first waiting command
                if (this.currentCommandResolvers.length > 0) {
                  const { resolve: resolveCmd } = this.currentCommandResolvers.shift()!;
                  clearTimeout(timeout);
                  resolveCmd(result);
                }
                return;
              } catch (e) {
                // Not JSON, probably debug output
                console.log('Audio service debug:', line);
              }
            }
          } catch (error) {
            console.log('Audio service raw output:', data.toString());
          }
        });

        this.audioService.stderr?.on('data', (data) => {
          console.log('Audio service error:', data.toString());
        });

        this.audioService.on('error', (error) => {
          console.error('Audio service process error:', error);
          // Reject all waiting commands
          this.currentCommandResolvers.forEach(({ reject: rejectCmd }) => {
            rejectCmd(error);
          });
          this.currentCommandResolvers = [];
          clearTimeout(timeout);
        });

        this.audioService.on('close', (code) => {
          console.log('Audio service closed with code:', code);
          this.audioService = null;

          // Reject all waiting commands
          this.currentCommandResolvers.forEach(({ reject: rejectCmd }) => {
            rejectCmd(new Error(`Audio service closed with code ${code}`));
          });
          this.currentCommandResolvers = [];
        });
      }

      // Send command
      console.log('Sending audio command:', command);
      if (this.audioService && this.audioService.stdin) {
        this.audioService.stdin.write(JSON.stringify(command) + '\n');
      } else {
        reject(new Error('Audio service not available'));
      }
    });
  }
  private loadVoiceNotes() {
    const notesPath = path.join(this.context.globalStorageUri.fsPath, 'voicenotes.json');

    try {
      if (fs.existsSync(notesPath)) {
        const data = fs.readFileSync(notesPath, 'utf8');
        this.voiceNotes = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load voice notes:', error);
      this.voiceNotes = [];
    }
  }

  private saveVoiceNotes() {
    const notesPath = path.join(this.context.globalStorageUri.fsPath, 'voicenotes.json');

    try {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(notesPath), { recursive: true });
      fs.writeFileSync(notesPath, JSON.stringify(this.voiceNotes, null, 2));
    } catch (error) {
      console.error('Failed to save voice notes:', error);
    }
  }

  updateWebview() {
    if (this.webviewView) {
      this.webviewView.webview.postMessage({
        command: 'updateState',
        isListening: this.isListening,
        ambientListening: this.ambientListening,
        voiceNotes: this.voiceNotes,
      });
    }
  }

  setWebviewView(webviewView: vscode.WebviewView) {
    this.webviewView = webviewView;
  }

  cleanup() {
    // Stop any ongoing recording
    this.isListening = false;
    this.ambientListening = false;

    // Kill audio service
    if (this.audioService && !this.audioService.killed) {
      this.audioService.kill('SIGTERM');
      setTimeout(() => {
        if (this.audioService && !this.audioService.killed) {
          this.audioService.kill('SIGKILL');
        }
      }, 2000);
      this.audioService = null;
    }

    // Reject any pending commands
    this.currentCommandResolvers.forEach(({ reject }) => {
      reject(new Error('Extension deactivated'));
    });
    this.currentCommandResolvers = [];
  }
}

class VoiceNotesWebviewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly extensionUri: vscode.Uri,
    private voiceNotesManager: VoiceNotesManager
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.voiceNotesManager.setWebviewView(webviewView);

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'startListening':
          this.voiceNotesManager.startListening();
          break;
        case 'stopListening':
          this.voiceNotesManager.stopListening();
          break;
        case 'toggleAmbient':
          this.voiceNotesManager.toggleAmbientListening();
          break;
        case 'generateSummary':
          this.voiceNotesManager.generateSummary();
          break;
      }
    });

    // Initialize webview with current state
    setTimeout(() => {
      this.voiceNotesManager.updateWebview();
    }, 100);
  }

  private getHtmlContent(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceNotes AI</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 16px;
        }
        .button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            margin: 4px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .button.recording {
            background-color: #ff4444;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        .status {
            margin: 16px 0;
            padding: 12px;
            border-radius: 4px;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
        }
        .voice-note {
            margin: 12px 0;
            padding: 12px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            background-color: var(--vscode-editor-background);
        }
        .voice-note-header {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }
        .voice-note-text {
            margin: 8px 0;
            line-height: 1.4;
        }
        .voice-note-summary {
            margin-top: 8px;
            padding: 8px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            font-style: italic;
        }
        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <h2>🎤 VoiceNotes AI</h2>
    
    <div class="controls">
        <button id="recordBtn" class="button">🎤 Start Recording</button>
        <button id="ambientBtn" class="button">🌍 Toggle Ambient</button>
        <button id="summaryBtn" class="button">✨ Generate Summary</button>
    </div>
    
    <div id="status" class="status">
        Ready to record - click Start Recording or use Ctrl+Shift+V
    </div>
    
    <div id="voiceNotes"></div>

    <script>
        const vscode = acquireVsCodeApi();
        
        let isListening = false;
        let ambientListening = false;
        let voiceNotes = [];
        
        const recordBtn = document.getElementById('recordBtn');
        const ambientBtn = document.getElementById('ambientBtn');
        const summaryBtn = document.getElementById('summaryBtn');
        const statusDiv = document.getElementById('status');
        const voiceNotesDiv = document.getElementById('voiceNotes');
        
        recordBtn.addEventListener('click', () => {
            if (isListening) {
                vscode.postMessage({ command: 'stopListening' });
            } else {
                vscode.postMessage({ command: 'startListening' });
            }
        });
        
        ambientBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'toggleAmbient' });
        });
        
        summaryBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'generateSummary' });
        });
        
        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.command === 'updateState') {
                isListening = message.isListening;
                ambientListening = message.ambientListening;
                voiceNotes = message.voiceNotes || [];
                
                updateUI();
            }
        });
        
        function updateUI() {
            // Update recording button
            if (isListening) {
                recordBtn.textContent = '⏹️ Stop Recording';
                recordBtn.classList.add('recording');
            } else {
                recordBtn.textContent = '🎤 Start Recording';
                recordBtn.classList.remove('recording');
            }
            
            // Update ambient button
            ambientBtn.textContent = ambientListening ? '🔴 Stop Ambient' : '🌍 Start Ambient';
            
            // Update status
            let statusText = 'Ready to record';
            if (isListening) statusText = '🎤 Recording...';
            if (ambientListening) statusText = '🌍 Ambient listening active';
            statusDiv.textContent = statusText;
            
            // Update voice notes
            renderVoiceNotes();
        }
        
        function renderVoiceNotes() {
            voiceNotesDiv.innerHTML = '';
            
            if (voiceNotes.length === 0) {
                voiceNotesDiv.innerHTML = '<p>No voice notes yet. Start recording to create your first note!</p>';
                return;
            }
            
            voiceNotes.reverse().forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'voice-note';
                
                const timestamp = new Date(note.timestamp).toLocaleString();
                const languageFlag = getLanguageFlag(note.language);
                
                noteDiv.innerHTML = \`
                    <div class="voice-note-header">
                        \${languageFlag} \${note.language} • \${note.source} • \${timestamp}
                    </div>
                    <div class="voice-note-text">\${note.text}</div>
                    \${note.summary ? \`<div class="voice-note-summary"><strong>AI Summary:</strong> \${note.summary}</div>\` : ''}
                \`;
                
                voiceNotesDiv.appendChild(noteDiv);
            });
        }
        
        function getLanguageFlag(language) {
            const flags = {
                'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
                'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
                'ar': '🇸🇦', 'hi': '🇮🇳', 'tr': '🇹🇷', 'nl': '🇳🇱', 'sv': '🇸🇪'
            };
            return flags[language] || '🌐';
        }
    </script>
</body>
</html>`;
  }
}

export function deactivate() {
  console.log('VoiceNotes AI extension deactivated');
  if (globalVoiceNotesManager) {
    globalVoiceNotesManager.cleanup();
    globalVoiceNotesManager = undefined;
  }
}
