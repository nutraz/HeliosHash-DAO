import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { voiceService } from '../services/voiceService';
import { useAuthContext } from './useAuthContext.tsx';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastCommand] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    // Check if voice is supported
    setIsSupported(voiceService.isSupported());

    // Load voice preference from localStorage
    const savedPreference = localStorage.getItem('voiceEnabled');
    if (savedPreference !== null) {
      setIsEnabled(JSON.parse(savedPreference));
    }

    // Register voice commands
    if (user) {
      registerCommands();
    }

    return () => {
      // Cleanup: stop listening when component unmounts
      voiceService.stopListening();
    };
  }, [user]);

  const registerCommands = useCallback(() => {
    // Navigation commands
    voiceService.registerCommand(
      'go to dashboard',
      () => navigate('/'),
      'Navigate to dashboard'
    );

    voiceService.registerCommand(
      'show projects',
      () => navigate('/projects'),
      'Navigate to projects page'
    );

    voiceService.registerCommand(
      'go to governance',
      () => navigate('/governance'),
      'Navigate to governance page'
    );

    voiceService.registerCommand(
      'show nft marketplace',
      () => navigate('/nft'),
      'Navigate to NFT marketplace'
    );

    // User info commands
    voiceService.registerCommand(
      'who am i',
      () => {
        if (user) {
          voiceService.speak(`You are ${user.username}, a verified member of HeliosHash DAO.`);
        } else {
          voiceService.speak('You are not logged in.');
        }
      },
      'Get user information'
    );

    voiceService.registerCommand(
      'what is my status',
      () => {
        voiceService.speak('You are a verified contributor with governance rights and staking privileges.');
      },
      'Get user status'
    );

    // Help commands
    voiceService.registerCommand(
      'help',
      () => {
        const commands = voiceService.getAvailableCommands();
        const commandList = commands.map(cmd => cmd.description).join(', ');
        voiceService.speak(`Available commands: ${commandList}`);
      },
      'Show available commands'
    );

    voiceService.registerCommand(
      'what can i say',
      () => {
        voiceService.speak('You can say: go to dashboard, show projects, go to governance, show NFT marketplace, who am I, what is my status, or help.');
      },
      'List voice commands'
    );

    // App-specific commands
    voiceService.registerCommand(
      'create project',
      () => {
        voiceService.speak('Opening project creation form.');
        navigate('/projects');
      },
      'Create new project'
    );

    voiceService.registerCommand(
      'read notifications',
      () => {
        voiceService.speak('You have no new notifications at this time.');
      },
      'Read notifications'
    );

    voiceService.registerCommand(
      'check status',
      () => {
        voiceService.speak('All systems are operational. Solar projects are running at optimal capacity.');
      },
      'Check system status'
    );
  }, [navigate, user]);

  const toggleVoice = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('voiceEnabled', JSON.stringify(newState));

    if (newState) {
      voiceService.speak('Voice assistance enabled. Say "help" to see available commands.');
    } else {
      voiceService.stopListening();
      setIsListening(false);
      voiceService.speak('Voice assistance disabled.');
    }
  }, [isEnabled]);

  const startListening = useCallback(async () => {
    if (!isEnabled) {
      voiceService.speak('Voice assistance is disabled. Please enable it first.');
      return;
    }

    try {
      await voiceService.startListening();
      setIsListening(true);
      voiceService.speak('Listening...');
    } catch (error) {
      console.error('Failed to start listening:', error);
      voiceService.speak('Sorry, I couldn\'t start listening. Please check your microphone permissions.');
    }
  }, [isEnabled]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (isEnabled) {
      voiceService.speak(text, options);
    }
  }, [isEnabled]);

  // Auto-stop listening after a period of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isListening) {
      timeout = setTimeout(() => {
        stopListening();
        voiceService.speak('Stopped listening due to inactivity.');
      }, 10000); // 10 seconds
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isListening, stopListening]);

  return {
    isListening,
    isEnabled,
    isSupported,
    lastCommand,
    toggleVoice,
    startListening,
    stopListening,
    speak,
    getAvailableCommands: () => voiceService.getAvailableCommands(),
  };
};
