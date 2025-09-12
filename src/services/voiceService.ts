interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

class VoiceService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private commands: VoiceCommand[] = [];

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';


      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        this.processCommand(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.speak('Sorry, I didn\'t catch that. Please try again.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  registerCommand(command: string, action: () => void, description: string) {
    this.commands.push({ command: command.toLowerCase(), action, description });
  }

  private processCommand(transcript: string) {
    console.log('Processing voice command:', transcript);

    // Find matching command
    const matchedCommand = this.commands.find(cmd =>
      transcript.includes(cmd.command) ||
      cmd.command.split(' ').every(word => transcript.includes(word))
    );

    if (matchedCommand) {
      this.speak(`Executing: ${matchedCommand.description}`);
      matchedCommand.action();
    } else {
      this.speak('Command not recognized. Say "help" to see available commands.');
    }
  }

  startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      try {
        this.isListening = true;
        this.recognition.start();
        resolve();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Set voice (prefer female voice for better UX)
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synthesis.speak(utterance);
  }

  getAvailableCommands(): VoiceCommand[] {
    return this.commands;
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Create singleton instance
export const voiceService = new VoiceService();

// Extend window interface for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var SpeechRecognition: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var webkitSpeechRecognition: any;
}
