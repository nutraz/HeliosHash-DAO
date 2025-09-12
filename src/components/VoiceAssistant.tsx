import * as React from 'react';
import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

const VoiceAssistant: React.FC = () => {
  const {
    isListening,
    isEnabled,
    isSupported,
    toggleVoice,
    startListening,
    stopListening,
    speak,
    getAvailableCommands,
  } = useVoice();

  const [showHelp, setShowHelp] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');

  useEffect(() => {
    // Welcome message when voice is enabled
    if (isEnabled && !lastSpokenText) {
      const welcomeMessage = 'Voice assistance is now active. Say "help" to see available commands.';
      speak(welcomeMessage);
      setLastSpokenText(welcomeMessage);
    }
  }, [isEnabled, speak, lastSpokenText]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center">
          <VolumeX className="w-5 h-5 mr-2" />
          <span className="text-sm">Voice assistance not supported in this browser</span>
        </div>
      </div>
    );
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
    if (!showHelp) {
      const commands = getAvailableCommands();
      const helpText = `Available commands: ${commands.map(cmd => cmd.command).join(', ')}`;
      speak(helpText);
    }
  };

  return (
    <>
      {/* Main Voice Assistant Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* Help Panel */}
          {showHelp && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
              <h3 className="font-semibold text-gray-800 mb-2">Voice Commands</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {getAvailableCommands().map((cmd, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">"{cmd.command}"</span>
                    <span className="text-gray-500 ml-2">{cmd.description}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Close
              </button>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex space-x-2">
            {/* Help Button */}
            <button
              onClick={handleHelpClick}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                showHelp
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Voice commands help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Voice Toggle Button */}
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                isEnabled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={isEnabled ? 'Disable voice assistance' : 'Enable voice assistance'}
            >
              {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Microphone Button */}
            {isEnabled && (
              <button
                onClick={handleMicClick}
                className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-sm font-medium">Listening...</span>
          </div>
        </div>
      )}

      {/* Voice Status Toast */}
      {isEnabled && (
        <div className="fixed top-4 right-4 z-40">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center">
              <Volume2 className="w-4 h-4 mr-2" />
              <span className="text-sm">Voice assistance active</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
