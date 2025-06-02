// Logger utility to control console output

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  level: LogLevel;
  enabledCategories: string[];
  silenceWarnings?: string[];
}

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

class Logger {
  private config: LoggerConfig;

  constructor() {
    // Initialize from environment or defaults
    const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel;
    const envCategories = process.env.NEXT_PUBLIC_LOG_CATEGORIES?.split(',').map(c => c.trim());
    
    this.config = {
      level: envLevel || (process.env.NODE_ENV === 'production' ? 'error' : 'info'),
      enabledCategories: envCategories || ['connection', 'journal', 'error'],
      silenceWarnings: [
        'Maximum update depth exceeded',
        'Failed to load resource',
        'silence detected on local audio track',
        'could not playback audio',
        'NotAllowedError',
        '__nextjs_original-stack-frame',
      ],
    };
  }

  setLevel(level: LogLevel) {
    this.config.level = level;
  }

  setEnabledCategories(categories: string[]) {
    this.config.enabledCategories = categories;
  }

  private shouldLog(level: LogLevel): boolean {
    return logLevels[level] >= logLevels[this.config.level];
  }

  private shouldSilence(message: string): boolean {
    if (!this.config.silenceWarnings) return false;
    
    return this.config.silenceWarnings.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  debug(category: string, message: string, ...args: any[]) {
    if (this.shouldLog('debug') && this.config.enabledCategories.includes(category)) {
      console.log(`[${category}] ${message}`, ...args);
    }
  }

  info(category: string, message: string, ...args: any[]) {
    if (this.shouldLog('info') && this.config.enabledCategories.includes(category)) {
      console.log(`[${category}] ${message}`, ...args);
    }
  }

  warn(category: string, message: string, ...args: any[]) {
    if (this.shouldLog('warn') && !this.shouldSilence(message)) {
      console.warn(`[${category}] ${message}`, ...args);
    }
  }

  error(category: string, message: string, ...args: any[]) {
    if (this.shouldLog('error') && !this.shouldSilence(message)) {
      console.error(`[${category}] ${message}`, ...args);
    }
  }

  // Direct console override for third-party libraries
  overrideConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    // Only show essential logs
    console.log = (...args: any[]) => {
      const message = args.join(' ');
      // Keep connection and journal logs
      if (message.includes('[Connection]') || 
          message.includes('[HMR]') || 
          message.includes('JOURNAL') ||
          message.includes('Agent connected') ||
          message.includes('Room connected')) {
        originalLog.apply(console, args);
      } else if (this.shouldLog('debug')) {
        // Only show other logs in debug mode
        originalLog.apply(console, args);
      }
    };

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (!this.shouldSilence(message)) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (!this.shouldSilence(message)) {
        originalError.apply(console, args);
      }
    };
  }

  // Restore original console methods
  restoreConsole() {
    // This would need to store the originals, but for now we'll skip this
  }
}

export const logger = new Logger();

// Initialize console override based on environment
if (typeof window !== 'undefined') {
  const suppressWarnings = process.env.NEXT_PUBLIC_SUPPRESS_DEV_WARNINGS === 'true';
  if (suppressWarnings || process.env.NODE_ENV === 'production') {
    logger.overrideConsole();
  }
} 