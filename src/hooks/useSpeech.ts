import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseSpeechOptions {
  continuous?: boolean;
  interimResults?: boolean;
  autoStart?: boolean;
}

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check for browser support
  useEffect(() => {
    const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
    const hasSpeechRecognition = 'SpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;

    setIsSupported((hasWebkitSpeechRecognition || hasSpeechRecognition) && hasSpeechSynthesis);
  }, []);

  // Language mapping for speech recognition
  const getRecognitionLanguage = useCallback(() => {
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      grw: 'hi-IN', // Fallback to Hindi for Garhwali
      kfy: 'hi-IN', // Fallback to Hindi for Kumaoni
      bho: 'hi-IN', // Fallback to Hindi for Bhojpuri
    };

    return langMap[i18n.language] || 'en-IN';
  }, [i18n.language]);

  // Speech synthesis (Text-to-Speech)
  const speak = useCallback(
    (text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) => {
      if (!isSupported || !text.trim()) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure utterance
      utterance.lang = getRecognitionLanguage();
      utterance.rate = options.rate || 0.8; // Slower for clarity in rural contexts
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Event handlers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
      };

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, getRecognitionLanguage]
  );

  // Speech recognition (Speech-to-Text)
  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = getRecognitionLanguage();
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || true;
    recognition.maxAlternatives = 3;

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [
    isSupported,
    isListening,
    getRecognitionLanguage,
    options.continuous,
    options.interimResults,
  ]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const stopSpeaking = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  // Auto-start if specified
  useEffect(() => {
    if (options.autoStart && isSupported && !isListening) {
      startListening();
    }
  }, [options.autoStart, isSupported, isListening, startListening]);

  return {
    // State
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    error,

    // Actions
    speak,
    startListening,
    stopListening,
    stopSpeaking,

    // Utilities
    clearTranscript: () => setTranscript(''),
    clearError: () => setError(null),
  };
};
