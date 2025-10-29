export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(`[INFO] ${message}`, context || '');
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, context || '');
  },

  error: (message: string, context?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, context || '');
  },

  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  },
};
