#!/bin/bash
# VoiceNotes AI Setup Script

set -e

echo "🎤 Setting up VoiceNotes AI Extension..."

# Get the extension directory
EXT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Extension directory: $EXT_DIR"

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed"
    exit 1
fi

# Check pip installation
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install --user -r "$EXT_DIR/requirements.txt"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd "$EXT_DIR"
npm install

# Check audio system
echo "🔊 Checking audio system..."
if command -v pactl &> /dev/null; then
    echo "✅ PulseAudio detected"
    # List audio devices
    echo "Available audio input devices:"
    pactl list sources short 2>/dev/null || true
elif command -v alsactl &> /dev/null; then
    echo "✅ ALSA detected"
else
    echo "⚠️ No audio system detected - audio capture may not work"
fi

# Check Ollama installation (optional)
echo "🤖 Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama found"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags &> /dev/null; then
        echo "✅ Ollama service is running"
        
        # Check for models
        MODELS=$(curl -s http://localhost:11434/api/tags | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    models = [m['name'] for m in data.get('models', [])]
    print(' '.join(models))
except:
    pass
" 2>/dev/null || echo "")
        
        if [ -n "$MODELS" ]; then
            echo "✅ Available models: $MODELS"
        else
            echo "⚠️ No Ollama models found - run 'ollama pull llama3.2' to download a model"
        fi
    else
        echo "⚠️ Ollama is installed but not running - run 'ollama serve' to start"
    fi
else
    echo "⚠️ Ollama not found - AI summaries will not work"
    echo "   Install from: https://ollama.ai"
fi

# Test Whisper installation
echo "🗣️ Testing Whisper installation..."
python3 -c "
import whisper
print('✅ Whisper is properly installed')
try:
    model = whisper.load_model('tiny')
    print('✅ Whisper tiny model loaded successfully')
except Exception as e:
    print(f'⚠️ Whisper model loading issue: {e}')
" 2>/dev/null || echo "❌ Whisper installation issue - check requirements.txt"

# Test audio capture
echo "🎙️ Testing audio capture..."
python3 -c "
import sounddevice as sd
import numpy as np
try:
    # Test recording for 0.1 seconds
    audio = sd.rec(int(0.1 * 16000), samplerate=16000, channels=1)
    sd.wait()
    if len(audio) > 0:
        print('✅ Audio capture working')
    else:
        print('⚠️ Audio capture returned no data')
except Exception as e:
    print(f'❌ Audio capture error: {e}')
    print('   Check audio permissions and device availability')
" 2>/dev/null || echo "❌ Audio capture test failed"

# Build TypeScript extension
echo "🔨 Building extension..."
npm run compile

# Create VS Code extension package
if command -v vsce &> /dev/null; then
    echo "📦 Creating extension package..."
    vsce package --out voicenotesai.vsix
    echo "✅ Extension package created: voicenotesai.vsix"
    echo ""
    echo "To install the extension:"
    echo "  code --install-extension voicenotesai.vsix"
else
    echo "⚠️ vsce not found - install with 'npm install -g vsce' to package extension"
fi

echo ""
echo "🎉 VoiceNotes AI setup complete!"
echo ""
echo "Next steps:"
echo "1. Install the extension: code --install-extension voicenotesai.vsix"
echo "2. Restart VS Code"
echo "3. Use Ctrl+Shift+V to start voice recording"
echo "4. Use Ctrl+Shift+A to toggle ambient listening"
echo ""
echo "Features:"
echo "🎤 Record voice notes with multilingual transcription"
echo "🌍 Ambient listening for conversations and system audio"
echo "✨ AI-powered summaries (requires Ollama)"
echo "📁 Transcribe audio files"
echo "🔄 Real-time transcription display"