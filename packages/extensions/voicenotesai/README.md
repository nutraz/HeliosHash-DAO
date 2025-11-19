# VoiceNotes AI - VS Code Extension

🎤 **Multilingual voice transcription and AI-powered notes directly in VS Code**

VoiceNotes AI captures conversations from multiple sources, transcribes them in 99+ languages using OpenAI Whisper, and generates intelligent summaries using local LLMs.

## 🌟 Features

- **🎤 Voice Recording**: Record microphone input with one-click or keyboard shortcuts
- **🌍 Ambient Listening**: Continuously capture conversations happening around your device
- **🔊 System Audio Capture**: Record Zoom calls, YouTube videos, and other system audio
- **🗣️ Multilingual Support**: Automatic language detection and transcription in 99+ languages
- **✨ AI Summaries**: Generate intelligent notes and action items using local Ollama models
- **📁 File Transcription**: Transcribe existing audio files (MP3, WAV, FLAC, etc.)
- **🔄 Real-time Display**: Live transcription updates in dedicated VS Code panel
- **💾 Persistent Storage**: All voice notes saved locally with timestamps and metadata

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or navigate to the extension directory
cd /path/to/voicenotesai

# Run the setup script
./setup.sh

# Install the generated extension package
code --install-extension voicenotesai.vsix
```

### 2. Dependencies

The setup script automatically installs:

- **Python Dependencies**: OpenAI Whisper, sounddevice, numpy
- **Node.js Dependencies**: VS Code extension APIs, axios
- **Optional**: Ollama for AI summaries

### 3. Usage

#### Keyboard Shortcuts

- **Ctrl+Shift+V**: Start/Stop voice recording
- **Ctrl+Shift+A**: Toggle ambient listening mode

#### Commands (Ctrl+Shift+P)

- `VoiceNotes AI: Start Voice Recording`
- `VoiceNotes AI: Stop Voice Recording`
- `VoiceNotes AI: Toggle Ambient Listening`
- `VoiceNotes AI: Open Panel`
- `VoiceNotes AI: Transcribe Audio File`
- `VoiceNotes AI: Generate AI Summary`

#### Panel Interface

- Open the VoiceNotes AI panel from the Activity Bar
- Click buttons to control recording and view transcriptions
- Real-time status updates and conversation history

## 🛠️ Configuration

### VS Code Settings

```json
{
  "voicenotesai.whisperModel": "base", // tiny, base, small, medium, large
  "voicenotesai.ollamaModel": "llama3.2", // Ollama model for summaries
  "voicenotesai.captureSystemAudio": true, // Capture system audio
  "voicenotesai.autoSummarize": true, // Auto-generate summaries
  "voicenotesai.ambientSensitivity": 0.5 // Ambient listening threshold
}
```

### Whisper Models

| Model  | Size    | Speed   | Quality   |
| ------ | ------- | ------- | --------- |
| tiny   | 39 MB   | Fastest | Good      |
| base   | 74 MB   | Fast    | Better    |
| small  | 244 MB  | Medium  | Good      |
| medium | 769 MB  | Slow    | Very Good |
| large  | 1550 MB | Slowest | Best      |

## 🎯 Use Cases

### 🏢 Meetings & Calls

- **Zoom/Teams Calls**: Automatically capture and transcribe video conference audio
- **Phone Interviews**: Record and summarize important conversations
- **Standup Meetings**: Generate action items and key decisions

### 🎓 Learning & Research

- **Online Lectures**: Transcribe YouTube videos, podcasts, educational content
- **Language Practice**: Practice pronunciation and get multilingual feedback
- **Research Interviews**: Capture and organize qualitative data

### 💻 Development Workflow

- **Code Reviews**: Record explanation videos and generate summaries
- **Client Calls**: Document requirements and feature requests
- **Team Discussions**: Capture brainstorming sessions and technical discussions

### 🌍 Personal Productivity

- **Voice Journaling**: Quick voice notes with automatic transcription
- **Idea Capture**: Record thoughts while walking, driving, or away from keyboard
- **Meeting Preparation**: Voice-based note-taking and agenda creation

## 🔧 Technical Architecture

### Extension Components

```
src/extension.ts          # Main VS Code extension entry point
audio_service.py          # Python audio capture and Whisper integration
package.json             # Extension manifest and configuration
requirements.txt         # Python dependencies
```

### Audio Pipeline

1. **Capture**: sounddevice captures microphone/system audio in chunks
2. **Processing**: Audio chunks queued and processed by Whisper model
3. **Transcription**: Real-time language detection and text conversion
4. **Enhancement**: Optional noise reduction and audio preprocessing
5. **Storage**: Transcriptions saved with metadata (language, timestamp, source)

### AI Integration

- **Local Whisper**: OpenAI's Whisper runs locally for privacy and offline use
- **Local Ollama**: LLM summaries generated without sending data to cloud
- **Real-time Processing**: Streaming transcription for immediate feedback

## 🎛️ Advanced Configuration

### Audio System Setup

#### PulseAudio (Recommended)

```bash
# Monitor system audio for Zoom/browser capture
pactl load-module module-null-sink sink_name=virtual_sink
pactl load-module module-loopback source=virtual_sink.monitor sink=@DEFAULT_SINK@

# Set applications to use virtual sink for capture
```

#### ALSA Configuration

```bash
# Add to ~/.asoundrc for system audio capture
pcm.!default {
    type plug
    slave.pcm "dmix"
}
```

### Performance Optimization

#### Memory Usage

- Use `tiny` or `base` Whisper models for lower memory usage
- Adjust chunk duration in audio_service.py for processing speed vs accuracy
- Enable GPU acceleration with `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`

#### CPU Usage

- Reduce ambient listening sensitivity to avoid unnecessary processing
- Use smaller Ollama models like `llama3.2:1b` for faster summaries
- Adjust audio sample rate (16kHz recommended for speech)

## 🔒 Privacy & Security

- **Local Processing**: All audio processing happens on your device
- **No Cloud Data**: Whisper and Ollama run locally - no data sent to external services
- **Encrypted Storage**: Voice notes stored in VS Code's secure storage location
- **Audio Permissions**: Requires explicit microphone/system audio permissions

## 📊 Supported Languages

Whisper supports 99+ languages including:

🇺🇸 English • 🇪🇸 Spanish • 🇫🇷 French • 🇩🇪 German • 🇮🇹 Italian • 🇵🇹 Portuguese • 🇷🇺 Russian • 🇯🇵 Japanese • 🇰🇷 Korean • 🇨🇳 Chinese • 🇮🇳 Hindi • 🇸🇦 Arabic • 🇹🇷 Turkish • 🇳🇱 Dutch • 🇸🇪 Swedish • 🇳🇴 Norwegian • 🇩🇰 Danish • 🇫🇮 Finnish • 🇭🇺 Hungarian • 🇨🇿 Czech • 🇵🇱 Polish • 🇺🇦 Ukrainian • 🇧🇬 Bulgarian • 🇭🇷 Croatian • 🇷🇴 Romanian • 🇱🇻 Latvian • 🇱🇹 Lithuanian • 🇪🇪 Estonian • 🇸🇮 Slovenian • 🇸🇰 Slovak • 🇲🇹 Maltese • 🇨🇾 Greek

## 🚨 Troubleshooting

### Audio Issues

```bash
# Check audio devices
pactl list sources short

# Test microphone
arecord -f cd -t wav -d 5 test.wav && aplay test.wav

# Restart PulseAudio
pulseaudio -k && pulseaudio --start
```

### Permission Issues

```bash
# Add user to audio group
sudo usermod -a -G audio $USER

# Set audio device permissions
sudo chmod 666 /dev/snd/*
```

### Python Issues

```bash
# Reinstall Whisper
pip3 uninstall openai-whisper && pip3 install openai-whisper

# Check dependencies
python3 -c "import whisper, sounddevice, numpy; print('All imports successful')"
```

### Extension Issues

```bash
# Rebuild extension
npm run compile

# Check VS Code logs
code --log debug --verbose
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup

```bash
git clone <repository>
cd voicenotesai
npm install
./setup.sh
```

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI Whisper for excellent multilingual transcription
- Ollama for local LLM capabilities
- VS Code Extension API for seamless editor integration
- PulseAudio community for audio routing solutions
