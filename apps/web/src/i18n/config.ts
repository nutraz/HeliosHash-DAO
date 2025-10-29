import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
const resources = {
  hi: {
    translation: {
      welcome: 'हेलियोसहैश DAO में आपका स्वागत है',
      onboarding: {
        title: 'शुरुआती गाइड',
        step1: 'चरण 1: आपकी भाषा चुनें',
        step2: 'चरण 2: अपना वॉलेट कनेक्ट करें',
        step3: 'चरण 3: सदस्यता लें',
        voiceGuide: 'आवाज़ गाइड सुनें',
        continue: 'आगे बढ़ें',
        back: 'पीछे जाएं',
      },
      governance: {
        title: 'शासन',
        vote: 'मतदान करें',
        proposals: 'प्रस्ताव',
        createProposal: 'नया प्रस्ताव बनाएं',
      },
      incentives: {
        women: {
          title: 'महिला प्रोत्साहन कार्यक्रम',
          audioDescription: 'महिला सदस्यों के लिए विशेष लाभ और अवसर उपलब्ध हैं',
          bonusTokens: '20% बोनस OWP टोकन',
          priorityJobs: 'नौकरी में प्राथमिकता',
    microGrants: 'माइक्रो अनुदान ({{minAmount}}-{{maxAmount}})',
          mentorship: 'मेंटरशिप कार्यक्रम',
        },
        totalBonus: 'कुल बोनस अर्जित',
        bonus: {
          title: '20% बोनस OWP टोकन',
          description: 'टियर खरीद या प्रस्ताव प्रस्तुति पर',
        },
      },
      rewards: {
        claimAmount: 'आज {{amount}} दावा करें',
      },
      solar: {
        monitoring: 'सोलर मॉनिटरिंग',
        efficiency: 'दक्षता',
        temperature: 'तापमान',
        production: 'उत्पादन',
      },
      nft: {
        badges: 'सामुदायिक बैज',
        earned: 'अर्जित',
        locked: 'बंद',
        description: 'सामुदायिक योगदान के लिए विशेष एनएफटी बैज अर्जित करें',
      },
    },
  },
  en: {
    translation: {
      welcome: 'Welcome to HeliosHash DAO',
      onboarding: {
        title: 'Getting Started Guide',
        step1: 'Step 1: Choose Your Language',
        step2: 'Step 2: Connect Your Wallet',
        step3: 'Step 3: Join as Member',
        voiceGuide: 'Listen to Voice Guide',
        continue: 'Continue',
        back: 'Back',
      },
      governance: {
        title: 'Governance',
        vote: 'Vote',
        proposals: 'Proposals',
        createProposal: 'Create New Proposal',
      },
      incentives: {
        women: {
          title: "Women's Incentive Program",
          audioDescription: 'Special benefits and opportunities are available for women members',
          bonusTokens: '20% Bonus OWP Tokens',
          priorityJobs: 'Priority Job Access',
            microGrants: 'Micro Grants ({{minAmount}}-{{maxAmount}})',
          mentorship: 'Mentorship Program',
        },
        totalBonus: 'Total Bonus Earned',
        bonus: {
          title: '20% Bonus OWP Tokens',
          description: 'On tier purchase or proposal submission',
        },
      },
      rewards: {
        claimAmount: 'Claim {{amount}} today',
      },
      solar: {
        monitoring: 'Solar Monitoring',
        efficiency: 'Efficiency',
        temperature: 'Temperature',
        production: 'Production',
      },
      nft: {
        badges: 'Community Badges',
        earned: 'Earned',
        locked: 'Locked',
        description: 'Earn special NFT badges for community contributions',
      },
    },
  },
  grw: {
    translation: {
      welcome: 'हेलियोसहैश DAO मा आपकु स्वागत छ',
      onboarding: {
        title: 'शुरुवाती गाइड',
        step1: 'चरण 1: आपकी भाषा चुन्या',
        step2: 'चरण 2: आपकु वॉलेट जोड़्या',
        step3: 'चरण 3: सदस्यता लेण',
        voiceGuide: 'आवाज़ गाइड सुण्या',
        continue: 'आग बढ़ण',
        back: 'पछ जाण',
      },
      governance: {
        title: 'शासन',
        vote: 'वोट देण',
        proposals: 'प्रस्ताव',
      },
      incentives: {
        women: {
          title: 'रमाली प्रोत्साहन',
          audioDescription: 'रमाल्यूं कि लागि विशेष फायदा छ',
          bonusTokens: '20% बोनस OWP टोकन',
          priorityJobs: 'काम मा पल्ली प्राथमिकता',
            microGrants: 'नानु अनुदान ({{minAmount}}-{{maxAmount}})',
          mentorship: 'गुरु कार्यक्रम',
        },
      },
      rewards: {
        claimAmount: 'आज {{amount}} दावा कर्या',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'hi',
    supportedLngs: ['hi', 'en', 'grw'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'querystring'],
      caches: ['localStorage'],
    },
  });

export default i18n;
