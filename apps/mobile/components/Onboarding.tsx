import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// NOTE: Make sure 'react-native' is installed and this file is used in a React Native/Expo project.

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Earn by Participating",
      description: "Complete simple tasks and contribute to local projects",
      icon: "💰"
    },
    {
      title: "Cash Out via UPI",
      description: "Convert HHU to INR and withdraw directly to your bank account",
      icon: "📱"
    },
    {
      title: "No Crypto Skills Needed",
      description: "We handle the complexity - you enjoy the benefits",
      icon: "🛡️"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
          setCurrentSlide(slide);
        }}
      >
        {slides.map((slide, index) => (
              <View key={index} style={{ width: '100%', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 24 }}>{slide.icon}</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#f3f4f6' }}>
              {slide.title}
            </Text>
                <Text style={{ fontSize: 18, color: '#9ca3af', textAlign: 'center' }}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={{ padding: 24 }}>
  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {slides.map((_, index) => (
            <View 
              key={index}
                  style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: index === currentSlide ? '#60a5fa' : '#4b5563' }}
            />
          ))}
        </View>
        
            <TouchableOpacity 
              style={{ backgroundColor: '#60a5fa', paddingVertical: 16, borderRadius: 8 }}
          onPress={() => navigation.navigate('PhoneVerification')}
        >
              <Text style={{ color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
            Start Earning — No Crypto Knowledge Needed
          </Text>
        </TouchableOpacity>
        
            <TouchableOpacity style={{ marginTop: 16 }}>
              <Text style={{ color: '#9ca3af', textAlign: 'center' }}>
                Skip (I'm experienced)
              </Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
