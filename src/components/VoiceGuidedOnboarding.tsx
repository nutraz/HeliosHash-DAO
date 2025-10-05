'use client';

// Re-export the new VoiceOnboardingFlow component for compatibility
export { default as VoiceGuidedOnboarding } from './VoiceOnboardingFlow';

// Temporary speech hook simulation
const useSpeech = () => ({
  isSupported: true,
  isListening: false,
  isSpeaking: false,
  transcript: '',
  error: null,
  speak: (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  },
  startListening: () => console.log('Starting to listen...'),
  stopListening: () => console.log('Stopped listening'),
  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
  clearTranscript: () => {},
  clearError: () => {},
});

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  audioScript: string;
  component: React.ReactNode;
  completed: boolean;
}

interface NFTBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: boolean;
  criteria: string;
}

export function VoiceGuidedOnboarding() {
  const { t, i18n } = useTranslation();
  const {
    speak,
    startListening,
    stopListening,
    isListening,
    isSpeaking,
    stopSpeaking,
    transcript,
    isSupported,
  } = useSpeech();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [membershipTier, setMembershipTier] = useState<string | null>(null);
  const [nftBadges, setNftBadges] = useState<NFTBadge[]>([
    {
      id: 'welcome',
      name: 'स्वागत बैज',
      description: 'DAO में सफल पंजीकरण',
      image: '🏆',
      earned: false,
      criteria: 'Complete onboarding process',
    },
    {
      id: 'language_master',
      name: 'भाषा मास्टर',
      description: 'हिंदी भाषा का चयन',
      image: '🗣️',
      earned: false,
      criteria: 'Select Hindi as preferred language',
    },
    {
      id: 'voice_pioneer',
      name: 'वॉइस पायनियर',
      description: 'वॉइस इंटरफेस का उपयोग',
      image: '🎤',
      earned: false,
      criteria: 'Use voice commands during onboarding',
    },
    {
      id: 'solar_advocate',
      name: 'सोलर एडवोकेट',
      description: 'सदस्यता पूर्ण',
      image: '☀️',
      earned: false,
      criteria: 'Complete membership registration',
    },
  ]);

  const languages = [
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'grw', name: 'गढ़वाली (Garhwali)', flag: '🏔️' },
    { code: 'kfy', name: 'कुमाऊँनी (Kumaoni)', flag: '🏔️' },
    { code: 'bho', name: 'भोजपुरी (Bhojpuri)', flag: '🌾' },
  ];

  const membershipTiers = [
    {
      id: 'basic',
      name: 'बेसिक सदस्य',
      price: '₹500',
      benefits: ['मतदान अधिकार', 'सामुदायिक फोरम एक्सेस', '5% बोनस OWP'],
    },
    {
      id: 'premium',
      name: 'प्रीमियम सदस्य',
      price: '₹2000',
      benefits: ['प्राथमिकता मतदान', 'माइक्रो-लोन एक्सेस', '15% बोनस OWP', 'NFT बैज'],
    },
    {
      id: 'trustee',
      name: 'ट्रस्टी',
      price: '₹10000',
      benefits: ['गवर्नेंस प्रस्ताव', 'मेंटरशिप प्रोग्राम', '25% बोनस OWP', 'विशेष NFT कलेक्शन'],
    },
  ];

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: t('onboarding.step1'),
      description: 'अपनी पसंदीदा भाषा चुनें। हम 28+ भारतीय भाषाओं का समर्थन करते हैं।',
      audioScript: 'नमस्कार! हेलियोसहैश डी ए ओ में आपका स्वागत है। कृपया अपनी भाषा चुनें।',
      component: <LanguageSelector />,
      completed: !!selectedLanguage,
    },
    {
      id: 2,
      title: t('onboarding.step2'),
      description: 'अपना डिजिटल वॉलेट कनेक्ट करें या नया वॉलेट बनाएं।',
      audioScript: 'अब आपका डिजिटल वॉलेट कनेक्ट करें। यह आपकी डिजिटल पहचान है।',
      component: <WalletConnection />,
      completed: walletConnected,
    },
    {
      id: 3,
      title: t('onboarding.step3'),
      description: 'सदस्यता योजना चुनें और समुदाय से जुड़ें।',
      audioScript:
        'अंतिम चरण: अपनी सदस्यता योजना चुनें। महिला सदस्यों को 20% अतिरिक्त लाभ मिलता है।',
      component: <MembershipSelection />,
      completed: !!membershipTier,
    },
  ];

  // Auto-play voice guide when step changes
  useEffect(() => {
    if (isVoiceEnabled && currentStep < steps.length) {
      const timer = setTimeout(() => {
        speak(steps[currentStep].audioScript);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isVoiceEnabled]);

  // Award badges based on progress
  useEffect(() => {
    setNftBadges((prev) =>
      prev.map((badge) => {
        switch (badge.id) {
          case 'language_master':
            return { ...badge, earned: selectedLanguage === 'hi' };
          case 'voice_pioneer':
            return { ...badge, earned: transcript.length > 0 };
          case 'solar_advocate':
            return { ...badge, earned: !!membershipTier };
          case 'welcome':
            return { ...badge, earned: currentStep >= 2 && !!membershipTier };
          default:
            return badge;
        }
      })
    );
  }, [selectedLanguage, transcript, membershipTier, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  function LanguageSelector() {
    return (
      <div className='space-y-4'>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='भाषा चुनें / Choose Language' />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedLanguage && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-700'>
              ✅ भाषा सफलतापूर्वक चुनी गई! / Language selected successfully!
            </p>
          </div>
        )}
      </div>
    );
  }

  function WalletConnection() {
    return (
      <div className='space-y-4'>
        <div className='grid gap-3'>
          <Button
            onClick={() => setWalletConnected(true)}
            className='w-full'
            variant={walletConnected ? 'secondary' : 'default'}
          >
            {walletConnected ? '✅ वॉलेट कनेक्ट हो गया' : 'वॉलेट कनेक्ट करें'}
          </Button>

          <Button variant='outline' className='w-full'>
            नया वॉलेट बनाएं
          </Button>
        </div>

        {walletConnected && (
          <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-700'>🔐 वॉलेट Address: 0x1a2b...c3d4 (सैंपल)</p>
          </div>
        )}
      </div>
    );
  }

  function MembershipSelection() {
    return (
      <div className='space-y-4'>
        <div className='grid gap-3'>
          {membershipTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all ${
                membershipTier === tier.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setMembershipTier(tier.id)}
            >
              <CardHeader className='pb-3'>
                <div className='flex justify-between items-center'>
                  <CardTitle className='text-lg'>{tier.name}</CardTitle>
                  <Badge variant='outline' className='text-green-600'>
                    {tier.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='text-sm space-y-1'>
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className='flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {membershipTier && (
          <div className='p-4 bg-purple-50 border border-purple-200 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <Gift className='h-5 w-5 text-purple-600' />
              <span className='font-medium text-purple-800'>महिला सदस्यों के लिए विशेष!</span>
            </div>
            <p className='text-sm text-purple-700'>
              20% अतिरिक्त OWP टोकन + प्राथमिकता नौकरी पहुंच + मेंटरशिप सुविधा
            </p>
          </div>
        )}
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const earnedBadges = nftBadges.filter((badge) => badge.earned);

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold text-gray-800'>{t('welcome')}</h1>
        <p className='text-gray-600'>सौर ऊर्जा के माध्यम से समुदायिक विकास में भाग लें</p>
      </div>

      {/* Progress Bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-sm text-gray-600'>
          <span>प्रगति</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className='h-3' />
      </div>

      {/* Voice Controls */}
      {isSupported && (
        <div className='flex justify-center gap-2'>
          <Button
            variant={isVoiceEnabled ? 'default' : 'outline'}
            size='sm'
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          >
            {isVoiceEnabled ? <Volume2 className='h-4 w-4' /> : <VolumeX className='h-4 w-4' />}
            {isVoiceEnabled ? 'आवाज़ चालू' : 'आवाज़ बंद'}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => (isSpeaking ? stopSpeaking() : speak(steps[currentStep].audioScript))}
          >
            {isSpeaking ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
            {isSpeaking ? 'रोकें' : 'दोबारा सुनें'}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => (isListening ? stopListening() : startListening())}
          >
            {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
            {isListening ? 'सुनना बंद' : 'बोलें'}
          </Button>
        </div>
      )}

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Languages className='h-5 w-5' />
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{steps[currentStep].component}</CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className='h-4 w-4 mr-1' />
          {t('onboarding.back')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!steps[currentStep].completed || currentStep === steps.length - 1}
        >
          {t('onboarding.continue')}
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </div>

      {/* NFT Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5 text-yellow-500' />
              अर्जित बैज ({earnedBadges.length}/{nftBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {nftBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border-2 text-center ${
                    badge.earned
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className='text-2xl mb-1'>{badge.image}</div>
                  <div className='text-xs font-medium'>{badge.name}</div>
                  {badge.earned && <Star className='h-3 w-3 text-yellow-500 mx-auto mt-1' />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion */}
      {currentStep === steps.length - 1 && membershipTier && (
        <Card className='bg-green-50 border-green-300'>
          <CardContent className='pt-6 text-center'>
            <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
            <h3 className='text-xl font-bold text-green-800 mb-2'>बधाई हो! 🎉</h3>
            <p className='text-green-700'>आप सफलतापूर्वक HeliosHash DAO के सदस्य बन गए हैं!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
