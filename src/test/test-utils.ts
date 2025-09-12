// test-utils.ts
export const createUseVoiceMock = () => {
  const state = {
    isEnabled: false,
    isListening: false,
    isSupported: true,
    toggleVoice: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn(),
  };

  state.toggleVoice.mockImplementation(() => {
    state.isEnabled = !state.isEnabled;
    localStorage.setItem('voiceEnabled', String(state.isEnabled));
  });

  state.startListening.mockImplementation(() => {
    if (state.isEnabled) state.isListening = true;
  });

  state.stopListening.mockImplementation(() => {
    state.isListening = false;
  });

  return state;
};
