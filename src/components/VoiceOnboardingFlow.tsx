import { Award, Check, ChevronRight, Globe, Mic, User, Volume2, Zap } from 'lucide-react';
import { useState } from 'react';

const VoiceOnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [gender, setGender] = useState('');

  const languages = [
    { code: 'hi', name: 'हिन्दी', native: 'Hindi', flag: '🇮🇳' },
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'grw', name: 'गढ़वळी', native: 'Garhwali', flag: '🏔️' },
    { code: 'kfy', name: 'कुमाऊँनी', native: 'Kumaoni', flag: '🏔️' },
    { code: 'bho', name: 'भोजपुरी', native: 'Bhojpuri', flag: '🌾' },
  ];

  const steps = [
    {
      title: { hi: 'भाषा चुनें', en: 'Choose Language', grw: 'भाषा च्यूनो' },
      subtitle: {
        hi: 'अपनी भाषा में बात करें',
        en: 'Speak in your language',
        grw: 'अपण भाषा मा बात करो',
      },
    },
    {
      title: { hi: 'आपका स्वागत है', en: 'Welcome', grw: 'स्वागत छ' },
      subtitle: { hi: 'हेलियोसहैश DAO में', en: 'To HeliosHash DAO', grw: 'हेलियोसहैश DAO मा' },
    },
    {
      title: { hi: 'अपना नाम बताएं', en: 'Tell us your name', grw: 'अपणु नाम बताओ' },
      subtitle: { hi: 'बोलें या लिखें', en: 'Speak or type', grw: 'बोलो या लिखो' },
    },
    {
      title: { hi: 'लिंग चुनें', en: 'Select Gender', grw: 'लिंग च्यूनो' },
      subtitle: {
        hi: 'महिलाओं के लिए विशेष लाभ',
        en: 'Special benefits for women',
        grw: 'महिला खनु विशेष लाभ',
      },
    },
    {
      title: { hi: 'आपके पुरस्कार', en: 'Your Rewards', grw: 'तुमरा पुरस्कार' },
      subtitle: {
        hi: '20% बोनस + प्राथमिकता',
        en: '20% Bonus + Priority',
        grw: '20% बोनस + प्राथमिकता',
      },
    },
  ];

  const speak = (text) => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setUserInput('Simulated voice input');
    }, 2000);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      speak(steps[step + 1].title[selectedLanguage || 'en']);
    }
  };

  const getLang = () => selectedLanguage || 'en';

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 p-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8 pt-6'>
          <div className='inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg'>
            <Zap className='w-6 h-6 text-yellow-500' />
            <h1 className='text-2xl font-bold text-gray-800'>HeliosHash DAO</h1>
          </div>
          <p className='text-gray-600 mt-3'>UrgamU Smart City Initiative</p>
        </div>

        {/* Progress Bar */}
        <div className='bg-white rounded-full p-2 mb-6 shadow-md'>
          <div className='flex gap-2'>
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-2xl p-8 mb-6'>
          {/* Step 0: Language Selection */}
          {step === 0 && (
            <div className='space-y-6'>
              <div className='text-center'>
                <Globe className='w-16 h-16 mx-auto mb-4 text-purple-500' />
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Choose Your Language</h2>
                <p className='text-gray-600'>Select your preferred language for voice guidance</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      speak('Welcome to HeliosHash DAO');
                      setTimeout(nextStep, 1000);
                    }}
                    className='p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group'
                  >
                    <div className='flex items-center gap-4'>
                      <span className='text-4xl'>{lang.flag}</span>
                      <div className='text-left'>
                        <div className='font-bold text-gray-800 text-lg'>{lang.name}</div>
                        <div className='text-sm text-gray-500'>{lang.native}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className='text-center space-y-6'>
              <div className='w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                <Zap className='w-12 h-12 text-white' />
              </div>
              <h2 className='text-3xl font-bold text-gray-800'>{steps[1].title[getLang()]}</h2>
              <p className='text-xl text-gray-600'>{steps[1].subtitle[getLang()]}</p>
              <div className='bg-purple-50 p-6 rounded-xl'>
                <p className='text-gray-700 leading-relaxed'>
                  {getLang() === 'hi' && 'सौर ऊर्जा से संचालित, महिला-नेतृत्व वाला समुदाय शासन'}
                  {getLang() === 'en' && 'Solar-powered, women-led community governance'}
                  {getLang() === 'grw' && 'सौर ऊर्जा स महिला नेतृत्व वला समुदाय'}
                </p>
              </div>
              <button
                onClick={nextStep}
                className='px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto'
              >
                {getLang() === 'hi' ? 'आगे बढ़ें' : getLang() === 'grw' ? 'अग्गि बढ़ो' : 'Continue'}
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 2: Name Input */}
          {step === 2 && (
            <div className='space-y-6'>
              <div className='text-center'>
                <User className='w-16 h-16 mx-auto mb-4 text-purple-500' />
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                  {steps[2].title[getLang()]}
                </h2>
                <p className='text-gray-600'>{steps[2].subtitle[getLang()]}</p>
              </div>

              <div className='space-y-4'>
                <input
                  type='text'
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    getLang() === 'hi'
                      ? 'अपना नाम लिखें...'
                      : getLang() === 'grw'
                      ? 'अपणु नाम लिखो...'
                      : 'Type your name...'
                  }
                  className='w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg'
                />

                <div className='text-center text-gray-500'>
                  {getLang() === 'hi' ? 'या' : getLang() === 'grw' ? 'या' : 'or'}
                </div>

                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`w-full p-6 rounded-xl border-2 border-dashed transition-all ${
                    isListening
                      ? 'bg-red-50 border-red-400 animate-pulse'
                      : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  <Mic
                    className={`w-12 h-12 mx-auto mb-2 ${
                      isListening ? 'text-red-500' : 'text-purple-500'
                    }`}
                  />
                  <p className='font-semibold text-gray-700'>
                    {isListening
                      ? getLang() === 'hi'
                        ? 'सुन रहे हैं...'
                        : getLang() === 'grw'
                        ? 'सुणन लागड़ा...'
                        : 'Listening...'
                      : getLang() === 'hi'
                      ? 'बोलने के लिए टैप करें'
                      : getLang() === 'grw'
                      ? 'बोलन खनु दबाओ'
                      : 'Tap to speak'}
                  </p>
                </button>
              </div>

              <button
                onClick={nextStep}
                disabled={!userInput}
                className='w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {getLang() === 'hi' ? 'आगे बढ़ें' : getLang() === 'grw' ? 'अग्गि बढ़ो' : 'Continue'}
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Step 3: Gender Selection */}
          {step === 3 && (
            <div className='space-y-6'>
              <div className='text-center'>
                <Award className='w-16 h-16 mx-auto mb-4 text-pink-500' />
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                  {steps[3].title[getLang()]}
                </h2>
                <p className='text-gray-600'>{steps[3].subtitle[getLang()]}</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <button
                  onClick={() => {
                    setGender('female');
                    setTimeout(nextStep, 500);
                  }}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    gender === 'female'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className='text-5xl mb-3'>👩</div>
                  <div className='font-bold text-gray-800 text-lg mb-2'>
                    {getLang() === 'hi' ? 'महिला' : getLang() === 'grw' ? 'महिला' : 'Female'}
                  </div>
                  <div className='bg-pink-100 p-3 rounded-lg'>
                    <div className='text-sm font-semibold text-pink-800 mb-1'>
                      {getLang() === 'hi'
                        ? '🎁 विशेष लाभ'
                        : getLang() === 'grw'
                        ? '🎁 विशेष लाभ'
                        : '🎁 Special Benefits'}
                    </div>
                    <ul className='text-xs text-pink-700 space-y-1 text-left'>
                      <li>• 20% {getLang() === 'hi' ? 'बोनस टोकन' : 'Bonus Tokens'}</li>
                      <li>• {getLang() === 'hi' ? 'नौकरी में प्राथमिकता' : 'Priority Jobs'}</li>
                      <li>• {getLang() === 'hi' ? 'माइक्रो-ग्रांट' : 'Micro-Grants'}</li>
                    </ul>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGender('male');
                    setTimeout(nextStep, 500);
                  }}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    gender === 'male'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className='text-5xl mb-3'>👨</div>
                  <div className='font-bold text-gray-800 text-lg mb-2'>
                    {getLang() === 'hi' ? 'पुरुष' : getLang() === 'grw' ? 'पुरुष' : 'Male'}
                  </div>
                  <div className='bg-blue-100 p-3 rounded-lg'>
                    <div className='text-sm text-blue-700'>
                      {getLang() === 'hi'
                        ? 'मानक लाभ'
                        : getLang() === 'grw'
                        ? 'मानक लाभ'
                        : 'Standard Benefits'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGender('non-binary');
                    setTimeout(nextStep, 500);
                  }}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    gender === 'non-binary'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className='text-5xl mb-3'>🧑</div>
                  <div className='font-bold text-gray-800 text-lg'>
                    {getLang() === 'hi' ? 'अन्य' : getLang() === 'grw' ? 'अन्य' : 'Non-Binary'}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGender('prefer-not-to-say');
                    setTimeout(nextStep, 500);
                  }}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    gender === 'prefer-not-to-say'
                      ? 'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className='text-5xl mb-3'>🤐</div>
                  <div className='font-bold text-gray-800 text-lg'>
                    {getLang() === 'hi' ? 'नहीं बताना चाहते' : 'Prefer not to say'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Rewards Summary */}
          {step === 4 && (
            <div className='space-y-6'>
              <div className='text-center'>
                <div className='w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4'>
                  <Check className='w-12 h-12 text-white' />
                </div>
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                  {getLang() === 'hi'
                    ? '🎉 स्वागत है!'
                    : getLang() === 'grw'
                    ? '🎉 स्वागत छ!'
                    : '🎉 Welcome!'}
                </h2>
                <p className='text-xl text-gray-600'>{userInput || 'Community Member'}</p>
              </div>

              {gender === 'female' && (
                <div className='bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-200'>
                  <h3 className='font-bold text-pink-800 text-lg mb-4 flex items-center gap-2'>
                    <Award className='w-6 h-6' />
                    {getLang() === 'hi'
                      ? 'आपके विशेष लाभ'
                      : getLang() === 'grw'
                      ? 'तुमरा विशेष लाभ'
                      : 'Your Special Benefits'}
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3 bg-white p-4 rounded-lg'>
                      <div className='text-2xl'>🎁</div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          20% {getLang() === 'hi' ? 'बोनस OWP टोकन' : 'Bonus OWP Tokens'}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {getLang() === 'hi'
                            ? 'हर खरीद और प्रस्ताव पर'
                            : 'On every purchase & proposal'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-start gap-3 bg-white p-4 rounded-lg'>
                      <div className='text-2xl'>💼</div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          {getLang() === 'hi' ? 'नौकरी में प्राथमिकता' : 'Priority Job Access'}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {getLang() === 'hi'
                            ? 'सोलर टेक्निशियन, डेटा स्टीवर्ड'
                            : 'Solar Technician, Data Steward'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-start gap-3 bg-white p-4 rounded-lg'>
                      <div className='text-2xl'>💰</div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          {getLang() === 'hi'
                            ? 'माइक्रो-ग्रांट पात्रता'
                            : 'Micro-Grant Eligibility'}
                        </div>
                        <div className='text-sm text-gray-600'>
                          ₹5,000 - ₹20,000{' '}
                          {getLang() === 'hi' ? 'प्रोजेक्ट फंडिंग' : 'project funding'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-start gap-3 bg-white p-4 rounded-lg'>
                      <div className='text-2xl'>🏅</div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          {getLang() === 'hi' ? 'विशेष NFT बैज' : 'Exclusive NFT Badges'}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {getLang() === 'hi'
                            ? 'सोलर सिस्टर, उर्गम चेंजमेकर'
                            : 'Solar Sister, Urgam Changemaker'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='bg-blue-50 p-6 rounded-xl'>
                <h3 className='font-bold text-blue-800 mb-3'>
                  {getLang() === 'hi'
                    ? '🌱 अगले कदम'
                    : getLang() === 'grw'
                    ? '🌱 अगला कदम'
                    : '🌱 Next Steps'}
                </h3>
                <ul className='space-y-2 text-gray-700'>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-green-600' />
                    {getLang() === 'hi' ? 'अपना वॉलेट कनेक्ट करें' : 'Connect your wallet'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-green-600' />
                    {getLang() === 'hi' ? 'पहला टियर खरीदें' : 'Purchase first tier'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-green-600' />
                    {getLang() === 'hi' ? 'प्रस्तावों पर वोट करें' : 'Vote on proposals'}
                  </li>
                </ul>
              </div>

              <button
                onClick={() => alert('Redirecting to dashboard...')}
                className='w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all'
              >
                {getLang() === 'hi'
                  ? '🚀 डैशबोर्ड पर जाएं'
                  : getLang() === 'grw'
                  ? '🚀 डैशबोर्ड मा जाओ'
                  : '🚀 Go to Dashboard'}
              </button>
            </div>
          )}
        </div>

        {/* Voice Control Footer */}
        <div className='bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between'>
          <button
            onClick={() => speak('Voice guidance activated')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isSpeaking
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
            }`}
          >
            <Volume2 className='w-5 h-5' />
            <span className='text-sm font-medium'>
              {getLang() === 'hi'
                ? 'आवाज़ मार्गदर्शन'
                : getLang() === 'grw'
                ? 'आवाज मार्गदर्शन'
                : 'Voice Guide'}
            </span>
          </button>

          <div className='text-sm text-gray-500'>
            {getLang() === 'hi' ? 'चरण' : 'Step'} {step + 1} / {steps.length}
          </div>
        </div>

        {/* Footer Note */}
        <div className='text-center mt-6 text-sm text-gray-600'>
          <p>
            {getLang() === 'hi'
              ? '🌿 बघपत → उर्गम घाटी पायलट | सौर-संचालित समुदाय शासन'
              : getLang() === 'grw'
              ? '🌿 बघपत → उर्गम घाटी पायलट | सौर-संचालित समुदाय'
              : '🌿 Baghpat → Urgam Valley Pilot | Solar-Powered Community Governance'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceOnboardingFlow;
