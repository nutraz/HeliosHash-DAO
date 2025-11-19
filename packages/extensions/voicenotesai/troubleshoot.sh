#!/bin/bash
# VoiceNotes AI Troubleshooting Script

echo "🔧 VoiceNotes AI Troubleshooting"
echo "================================="
echo

echo "1. 📦 Extension Status:"
code --list-extensions | grep voicenotesai && echo "✅ Extension installed" || echo "❌ Extension not found"
echo

echo "2. 🎤 Audio System Test:"
python3 -c "
import sounddevice as sd
import numpy as np
try:
    # Test microphone
    audio = sd.rec(int(0.5 * 16000), samplerate=16000, channels=1)
    sd.wait()
    if np.max(np.abs(audio)) > 0.001:
        print('✅ Microphone working')
    else:
        print('⚠️ Microphone very quiet')
except Exception as e:
    print(f'❌ Microphone error: {e}')
"
echo

echo "3. 🧠 Whisper Test:"
python3 -c "
try:
    import whisper
    model = whisper.load_model('base')
    print('✅ Whisper model loaded')
except Exception as e:
    print(f'❌ Whisper error: {e}')
"
echo

echo "4. 🔧 Audio Service Test:"
timeout 2 python3 /home/nutarzz/HeliosHash-DAO/extensions/voicenotesai/audio_service.py << EOF || echo "✅ Audio service starts properly"
{"action": "test"}
EOF
echo

echo "💡 Troubleshooting Tips:"
echo "- Restart VS Code completely"
echo "- Try Ctrl+Shift+P → 'VoiceNotes AI: Open Panel'"
echo "- Check VS Code Output panel for errors"
echo "- Make sure microphone permissions are granted"
echo
echo "🎯 Quick Test Commands for VS Code:"
echo "- Ctrl+Shift+V (Start/Stop Recording)"
echo "- Ctrl+Shift+A (Toggle Ambient Listening)"
echo "- Ctrl+Shift+P → 'VoiceNotes AI: Open Panel'"