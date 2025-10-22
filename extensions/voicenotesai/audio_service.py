#!/usr/bin/env python3
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
        try:
            self.model = whisper.load_model(model_size)
            print(f"✅ Whisper {model_size} model loaded", file=sys.stderr)
        except Exception as e:
            print(f"❌ Error loading Whisper model: {e}", file=sys.stderr)
            sys.exit(1)
            
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
        
        # Clear any existing audio
        while not self.audio_queue.empty():
            try:
                self.audio_queue.get_nowait()
            except queue.Empty:
                break
        
        # Start audio capture thread
        self.audio_thread = threading.Thread(target=self._capture_audio)
        self.audio_thread.daemon = True
        self.audio_thread.start()
        
        print(f"🎤 Recording started from {source}", file=sys.stderr)
        return {"status": "recording_started", "source": source}
    
    def stop_recording(self):
        """Stop recording and return transcription"""
        if not self.is_recording:
            return {"error": "Not currently recording"}
            
        self.is_recording = False
        print("⏹️ Stopping recording...", file=sys.stderr)
        
        # Wait briefly for audio thread to stop
        if hasattr(self, 'audio_thread'):
            self.audio_thread.join(timeout=2)
        
        # Quick check if we have any audio
        if self.audio_queue.empty():
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        # Process accumulated audio (with faster processing)
        try:
            return self._process_audio_queue_fast()
        except Exception as e:
            print(f"❌ Fast processing failed, trying normal: {e}", file=sys.stderr)
            return self._process_audio_queue()
    
    def toggle_ambient_listening(self):
        """Toggle ambient listening mode"""
        self.ambient_mode = not self.ambient_mode
        
        if self.ambient_mode:
            print("🌍 Ambient listening enabled", file=sys.stderr)
            return self.start_recording("ambient")
        else:
            print("⏹️ Ambient listening disabled", file=sys.stderr)
            return self.stop_recording()
    
    def _capture_audio(self):
        """Capture audio in chunks"""
        chunk_duration = 1  # seconds
        chunk_samples = int(self.sample_rate * chunk_duration)
        
        def audio_callback(indata, frames, time, status):
            if status:
                print(f"Audio status: {status}", file=sys.stderr)
            if self.is_recording:
                # Add audio chunk to queue
                self.audio_queue.put(indata.copy())
        
        # Select audio device based on source
        device_id = None
        if self.source == "ambient":
            # Try to capture system audio for ambient mode
            device_id = self._get_system_audio_device()
            print(f"🌍 Ambient mode using device: {device_id}", file=sys.stderr)
        
        try:
            with sd.InputStream(
                samplerate=self.sample_rate,
                channels=1,
                callback=audio_callback,
                blocksize=chunk_samples,
                device=device_id
            ):
                print(f"🎤 Recording started - {self.source}", file=sys.stderr)
                while self.is_recording:
                    time.sleep(0.1)
                    
                    # In ambient mode, process chunks continuously
                    if self.ambient_mode and not self.audio_queue.empty():
                        # Process every 3 seconds in ambient mode for better transcription
                        if hasattr(self, '_last_ambient_process'):
                            if time.time() - self._last_ambient_process < 3:
                                continue
                        
                        result = self._process_audio_queue_ambient()
                        self._last_ambient_process = time.time()
                        
                        if result.get("text") and len(result["text"].strip()) > 0:
                            print(json.dumps(result))
                            sys.stdout.flush()
                            
        except Exception as e:
            print(f"❌ Audio capture error: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def _process_audio_queue_fast(self):
        """Fast audio processing with minimal delay"""
        audio_chunks = []
        while not self.audio_queue.empty():
            try:
                chunk = self.audio_queue.get_nowait()
                audio_chunks.append(chunk)
            except queue.Empty:
                break
        
        if not audio_chunks:
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        # Concatenate audio
        audio_data = np.concatenate(audio_chunks, axis=0)
        audio_data = audio_data.flatten().astype(np.float32)
        
        # Quick audio validation
        if len(audio_data) < self.sample_rate * 0.3:  # Less than 0.3 seconds
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        if np.max(np.abs(audio_data)) < 0.0005:  # Very quiet
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        print(f"🔄 Fast transcribing {len(audio_data)} samples...", file=sys.stderr)
        
        # Use enhanced language detection for better accuracy
        result = self._detect_language_intelligently(audio_data)
        
        text = result.get("text", "").strip()
        detected_lang = result.get("language", "unknown")
        
        if text:
            lang_flag = "🇮🇳" if detected_lang == "hi" else "🇺🇸" if detected_lang == "en" else "🌍"
            print(f"✅ Fast transcribed {lang_flag}[{detected_lang}]: {text[:50]}...", file=sys.stderr)
        else:
            print("🔇 No speech detected", file=sys.stderr)
        
        return {
            "text": text,
            "language": detected_lang,
            "confidence": result.get("confidence", 1.0),
            "timestamp": int(time.time() * 1000),
            "source": self.source
        }

    def _detect_language_intelligently(self, audio_data):
        """Enhanced language detection for English and Hindi"""
        try:
            # First, try auto-detection to get a baseline
            result = self.model.transcribe(audio_data, language=None, word_timestamps=False, fp16=False)
            detected_lang = result.get('language', 'unknown')
            text = result.get('text', '').strip()
            
            print(f"🔍 Auto-detected language: {detected_lang}, text: '{text[:50]}...'", file=sys.stderr)
            
            # If we got reasonable text and it's English or Hindi, trust it
            if len(text) > 2 and detected_lang in ['en', 'hi']:
                return result
            
            # Try Hindi specifically for Indian content
            if len(text) > 2:
                try:
                    hi_result = self.model.transcribe(audio_data, language="hi", word_timestamps=False, fp16=False)
                    hi_text = hi_result.get('text', '').strip()
                    
                    # Check if Hindi transcription is better (longer or contains Devanagari)
                    if len(hi_text) > len(text) or any(ord(c) > 0x0900 and ord(c) < 0x097F for c in hi_text):
                        print(f"🇮🇳 Hindi transcription better: '{hi_text[:50]}...'", file=sys.stderr)
                        return hi_result
                except Exception as e:
                    print(f"⚠️ Hindi transcription failed: {e}", file=sys.stderr)
            
            # Try English specifically
            try:
                en_result = self.model.transcribe(audio_data, language="en", word_timestamps=False, fp16=False)
                en_text = en_result.get('text', '').strip()
                
                if len(en_text) > len(text):
                    print(f"🇺🇸 English transcription better: '{en_text[:50]}...'", file=sys.stderr)
                    return en_result
            except Exception as e:
                print(f"⚠️ English transcription failed: {e}", file=sys.stderr)
            
            # Return the original auto-detected result
            return result
            
        except Exception as e:
            print(f"❌ Language detection error: {e}", file=sys.stderr)
            return {"text": "", "language": "unknown"}

    def _process_audio_queue_ambient(self):
        """Enhanced ambient processing with better English/Hindi support"""
        # Take only the last 3 seconds of audio for processing
        recent_chunks = []
        chunk_count = 0
        
        while not self.audio_queue.empty() and chunk_count < 3:  # Last 3 chunks
            try:
                chunk = self.audio_queue.get_nowait()
                recent_chunks.append(chunk)
                chunk_count += 1
            except queue.Empty:
                break
        
        if not recent_chunks:
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        # Concatenate recent audio
        audio_data = np.concatenate(recent_chunks, axis=0)
        audio_data = audio_data.flatten().astype(np.float32)
        
        # Lower threshold for ambient audio (podcasts/conversations)
        if len(audio_data) < self.sample_rate * 0.5:  # At least 0.5 seconds
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        if np.max(np.abs(audio_data)) < 0.003:  # Lower threshold for background audio
            return {"text": "", "language": "unknown", "timestamp": int(time.time() * 1000), "source": self.source}
        
        try:
            print(f"🌍 Ambient transcribing {len(audio_data)} samples...", file=sys.stderr)
            
            # Use enhanced language detection for better English/Hindi support
            result = self._detect_language_intelligently(audio_data)
            
            text = result.get("text", "").strip()
            detected_lang = result.get("language", "unknown")
            
            if text:
                lang_flag = "🇮🇳" if detected_lang == "hi" else "🇺🇸" if detected_lang == "en" else "🌍"
                print(f"🌍 Ambient {lang_flag}[{detected_lang}]: {text[:100]}...", file=sys.stderr)
            
            return {
                "text": text,
                "language": detected_lang,
                "confidence": result.get("confidence", 1.0),
                "timestamp": int(time.time() * 1000),
                "source": "ambient"
            }
            
        except Exception as e:
            print(f"❌ Ambient transcription error: {e}", file=sys.stderr)
            return {"error": str(e), "timestamp": int(time.time() * 1000), "source": "ambient"}

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
        
        if np.max(np.abs(audio_data)) < 0.001:  # Too quiet
            return {"text": "", "language": "unknown"}
        
        try:
            print(f"🔄 Transcribing {len(audio_data)} samples...", file=sys.stderr)
            
            # Use enhanced language detection for better English/Hindi support
            result = self._detect_language_intelligently(audio_data)
            
            text = result.get("text", "").strip()
            detected_lang = result.get("language", "unknown")
            
            if len(text) > 0:
                lang_flag = "🇮🇳" if detected_lang == "hi" else "🇺🇸" if detected_lang == "en" else "🌍"
                print(f"✅ Transcribed {lang_flag}[{detected_lang}]: {text[:50]}...", file=sys.stderr)
            
            return {
                "text": text,
                "language": detected_lang,
                "confidence": result.get("confidence", 1.0),
                "timestamp": int(time.time() * 1000),
                "source": self.source
            }
            
        except Exception as e:
            print(f"❌ Transcription error: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def transcribe_file(self, file_path):
        """Transcribe an audio file"""
        try:
            print(f"🔄 Transcribing file: {file_path}", file=sys.stderr)
            result = self.model.transcribe(file_path, language=None)
            
            return {
                "text": result["text"].strip(),
                "language": result.get("language", "unknown"),
                "confidence": 1.0,
                "timestamp": int(time.time() * 1000),
                "source": "file"
            }
        except Exception as e:
            print(f"❌ File transcription error: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def _get_system_audio_device(self):
        """Get the best device for capturing system audio (monitor sources)"""
        try:
            import subprocess
            
            # First, try to get PulseAudio monitor sources directly
            try:
                result = subprocess.run(['pactl', 'list', 'short', 'sources'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    sources = result.stdout.strip().split('\n')
                    for source in sources:
                        if 'monitor' in source and ('analog-stereo' in source or 'bluez' in source):
                            source_name = source.split('\t')[1]
                            print(f"🎧 Found monitor source: {source_name}", file=sys.stderr)
                            return source_name  # Return PulseAudio device name
            except Exception as e:
                print(f"⚠️ PulseAudio query failed: {e}", file=sys.stderr)
            
            # Fallback to sounddevice detection
            devices = sd.query_devices()
            
            # Look for monitor devices (captures what's playing)
            for i, device in enumerate(devices):
                name = device['name'].lower()
                
                # PipeWire monitor devices
                if 'monitor' in name and device['max_input_channels'] > 0:
                    print(f"🎧 Found monitor device: {device['name']}", file=sys.stderr)
                    return i
                
                # Firefox or browser audio
                if 'firefox' in name and device['max_input_channels'] > 0:
                    print(f"🦊 Found Firefox audio: {device['name']}", file=sys.stderr)
                    return i
                
                # Built-in audio with input capability
                if 'built-in' in name and 'stereo' in name and device['max_input_channels'] > 0:
                    print(f"🔊 Found built-in stereo: {device['name']}", file=sys.stderr)
                    return i
            
            # Fallback to PipeWire default
            for i, device in enumerate(devices):
                if 'pipewire' in device['name'].lower() and device['max_input_channels'] > 0:
                    print(f"🎵 Fallback to PipeWire: {device['name']}", file=sys.stderr)
                    return i
            
            print("⚠️ No system audio device found, using default microphone", file=sys.stderr)
            return None
            
        except Exception as e:
            print(f"❌ Error detecting system audio device: {e}", file=sys.stderr)
            return None

def main():
    print("🎤 Starting VoiceNotes AI Audio Service", file=sys.stderr)
    
    try:
        transcriber = AudioTranscriber(model_size="base")
        print("✅ Audio service ready", file=sys.stderr)
    except Exception as e:
        print(f"❌ Failed to initialize audio service: {e}", file=sys.stderr)
        sys.exit(1)
    
    try:
        while True:
            try:
                line = sys.stdin.readline()
                if not line:
                    print("📋 Input stream closed", file=sys.stderr)
                    break
                    
                command = json.loads(line.strip())
                action = command.get("action")
                
                print(f"📨 Received command: {action}", file=sys.stderr)
                
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
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON decode error: {e}", file=sys.stderr)
                print(json.dumps({"error": "Invalid JSON command"}))
                sys.stdout.flush()
            except Exception as e:
                print(f"❌ Command processing error: {e}", file=sys.stderr)
                print(json.dumps({"error": str(e)}))
                sys.stdout.flush()
                
    except KeyboardInterrupt:
        print("🛑 Service interrupted", file=sys.stderr)
    except Exception as e:
        print(f"❌ Service error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()