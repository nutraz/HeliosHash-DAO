#!/bin/bash

# HeliosHash DAO - Local AI Photo Analysis System
# Privacy-first photo analysis using local AI agents

echo "🤖 LOCAL AI PHOTO ANALYZER"
echo "=========================="
echo "🔒 100% Privacy - No data leaves your system"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

PHOTO_PATH="$1"
if [ -z "$PHOTO_PATH" ]; then
    echo "Usage: $0 /path/to/photo.jpg"
    echo "Example: $0 /home/nutarzz/Pictures/Rajesh_Photo.jpg"
    exit 1
fi

echo -e "\n${BLUE}🔍 ANALYZING PHOTO: $PHOTO_PATH${NC}"
echo "=================================="

# Check if file exists
if [ ! -f "$PHOTO_PATH" ]; then
    echo -e "${RED}❌ Photo not found: $PHOTO_PATH${NC}"
    exit 1
fi

# Get photo metadata first
echo -e "\n${PURPLE}📊 PHOTO METADATA ANALYSIS${NC}"
echo "=========================="
if command -v exiftool >/dev/null; then
    echo "📷 Camera Info:"
    exiftool "$PHOTO_PATH" | grep -E "Camera|Model|Date|GPS" | head -5
else
    echo "📁 Basic File Info:"
    file "$PHOTO_PATH"
    ls -lh "$PHOTO_PATH"
fi

# Method 1: Install and use LLaVA (Local Vision Model)
install_llava() {
    echo -e "\n${BLUE}🦙 INSTALLING LLAVA VISION MODEL${NC}"
    echo "================================="
    echo "🔄 Downloading LLaVA model for local photo analysis..."
    ollama pull llava:7b
    echo "✅ LLaVA model ready for photo analysis"
}

# Method 2: Use OpenCV for face detection
setup_opencv_analysis() {
    echo -e "\n${BLUE}📸 SETTING UP OPENCV FACE DETECTION${NC}"
    echo "===================================="
    
    # Install required packages
    echo "📦 Installing OpenCV and face detection tools..."
    sudo dnf install -y python3-opencv python3-pip
    pip3 install --user opencv-python opencv-contrib-python face-recognition pillow
    
    echo "✅ OpenCV face detection ready"
}

# Method 3: Create Python script for local analysis
create_face_analyzer() {
    cat > ~/local_photo_analyzer.py << 'EOF'
#!/usr/bin/env python3
"""
Local Photo Analyzer - 100% Privacy Guaranteed
Analyzes photos locally without external connections
"""

import cv2
import os
import sys
from datetime import datetime

def analyze_photo(photo_path):
    print("🔍 LOCAL PHOTO ANALYSIS STARTING...")
    print("=" * 40)
    
    if not os.path.exists(photo_path):
        print(f"❌ Photo not found: {photo_path}")
        return
    
    # Load the image
    image = cv2.imread(photo_path)
    if image is None:
        print("❌ Could not load image")
        return
    
    print(f"📷 Image loaded: {image.shape[1]}x{image.shape[0]} pixels")
    
    # Load face detection model (built into OpenCV)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Convert to grayscale for face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    print(f"\n👥 FACE DETECTION RESULTS:")
    print("=" * 25)
    print(f"Faces detected: {len(faces)}")
    
    if len(faces) > 0:
        print("\n📊 FACE ANALYSIS:")
        for i, (x, y, w, h) in enumerate(faces):
            print(f"  Face {i+1}: Position ({x},{y}), Size {w}x{h}")
            print(f"  Face {i+1}: Area {w*h} pixels")
            
            # Determine if this might be the main subject
            face_area = w * h
            image_area = image.shape[0] * image.shape[1]
            face_percentage = (face_area / image_area) * 100
            
            if face_percentage > 5:  # Large face suggests main subject
                print(f"  Face {i+1}: ⭐ LIKELY MAIN SUBJECT ({face_percentage:.1f}% of image)")
            elif face_percentage > 1:
                print(f"  Face {i+1}: 👤 Secondary person ({face_percentage:.1f}% of image)")
            else:
                print(f"  Face {i+1}: 👥 Background person ({face_percentage:.1f}% of image)")
    
    # Basic image analysis
    print(f"\n🎨 IMAGE PROPERTIES:")
    print("=" * 20)
    print(f"Resolution: {image.shape[1]}x{image.shape[0]}")
    print(f"Color channels: {image.shape[2] if len(image.shape) > 2 else 1}")
    
    # Brightness analysis
    brightness = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).mean()
    if brightness > 127:
        print(f"Lighting: Bright scene (brightness: {brightness:.0f}/255)")
    else:
        print(f"Lighting: Dark scene (brightness: {brightness:.0f}/255)")
    
    print(f"\n✅ Analysis complete - No data transmitted externally!")
    print("🔒 All processing done locally on your Fedora system")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 local_photo_analyzer.py /path/to/photo.jpg")
        sys.exit(1)
    
    analyze_photo(sys.argv[1])
EOF

    chmod +x ~/local_photo_analyzer.py
    echo "✅ Local photo analyzer created at ~/local_photo_analyzer.py"
}

# Method 4: Use Ollama with LLaVA for description
analyze_with_llava() {
    echo -e "\n${GREEN}🦙 ANALYZING WITH LLAVA (LOCAL AI)${NC}"
    echo "=================================="
    
    if ! ollama list | grep -q "llava"; then
        echo "📦 LLaVA not found. Installing..."
        ollama pull llava:7b
    fi
    
    echo "🤖 Generating AI description of photo..."
    echo "Prompt: 'Describe this photo focusing on the people in it. Who appears to be the main subject?'"
    
    # Use Ollama API to analyze the image
    curl -s -X POST http://localhost:11434/api/generate \
        -d "{
            \"model\": \"llava:7b\",
            \"prompt\": \"Describe this photo focusing on the people in it. Who appears to be the main subject? Provide details about age, clothing, position, and context.\",
            \"images\": [\"$(base64 -w 0 "$PHOTO_PATH")\"]
        }" | while IFS= read -r line; do
            echo "$line" | jq -r '.response // empty' 2>/dev/null
        done
    
    echo -e "\n✅ AI analysis complete (processed locally)"
}

# Main execution
echo -e "\n${YELLOW}🛡️ LOCAL AI ANALYSIS OPTIONS:${NC}"
echo "=============================="
echo "1. 📸 OpenCV Face Detection (Fast, Local)"
echo "2. 🦙 LLaVA AI Description (Detailed, Local)" 
echo "3. 📊 Metadata Analysis Only (Instant)"
echo "4. 🔄 Setup All Tools"

read -p "Choose analysis method (1-4): " choice

case $choice in
    1)
        if command -v python3 >/dev/null && python3 -c "import cv2" 2>/dev/null; then
            echo "✅ OpenCV available, running analysis..."
            if [ ! -f ~/local_photo_analyzer.py ]; then
                create_face_analyzer
            fi
            python3 ~/local_photo_analyzer.py "$PHOTO_PATH"
        else
            echo "📦 Installing OpenCV..."
            setup_opencv_analysis
            create_face_analyzer
            python3 ~/local_photo_analyzer.py "$PHOTO_PATH"
        fi
        ;;
    2)
        analyze_with_llava
        ;;
    3)
        echo "📊 Metadata-only analysis selected"
        ;;
    4)
        echo "🔄 Setting up all AI analysis tools..."
        setup_opencv_analysis
        create_face_analyzer  
        install_llava
        echo "✅ All tools ready! Re-run script to analyze photos."
        ;;
    *)
        echo "ℹ️ Metadata analysis only (no AI processing)"
        ;;
esac

echo -e "\n${GREEN}🔒 PRIVACY GUARANTEE:${NC}"
echo "===================="
echo "✅ All analysis performed locally on your Fedora system"
echo "✅ No data transmitted to external servers"
echo "✅ No cloud AI services used"
echo "✅ Your photos never leave your computer"
echo "✅ Complete privacy maintained"

echo -e "\n${BLUE}💡 USAGE EXAMPLES:${NC}"
echo "=================="
echo "# Analyze specific photo:"
echo "$0 /home/nutarzz/Pictures/Rajesh_Photo.jpg"
echo ""
echo "# Quick face detection:"
echo "python3 ~/local_photo_analyzer.py /path/to/photo.jpg"
echo ""
echo "# AI description (if LLaVA installed):"
echo "ollama run llava:7b 'Describe this image' < /path/to/photo.jpg"