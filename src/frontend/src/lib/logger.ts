/**
 * Centralized logging service
 * Replaces console statements with proper logging levels and production handling
 * 
 * Features:
 * - Configurable log levels (DEBUG, INFO, WARN, ERROR)
 * - Environment-aware logging (console in dev, remote in production)
 * - Structured logging with context
 * - Automatic timestamp and environment tagging
 * - Fallback handling for remote logging failures
 * 
 * @example
 * ```tsx
 * import { info, error, warn } from '@/lib/logger';
 * 
 * info('User logged in successfully', { userId: '123', component: 'Auth' });
 * warn('Deprecated API endpoint used', { endpoint: '/api/v1/users' });
 * error('Failed to fetch user data', new Error('Network error'), { userId: '123' });
 * ```
 */
export enum LogLevel {
  /** Debug level - detailed information for debugging */
  DEBUG = 0,
  /** Info level - general information about application flow */
  INFO = 1,
  /** Warn level - warnings that don't stop execution */
  WARN = 2,
  /** Error level - errors that may affect functionality */
  ERROR = 3,
}

/**
 * Context information for log entries
 * Provides additional metadata to help with debugging and monitoring
 */
export interface LogContext {
  /** Component name where the log originated */
  component?: string;
  /** Function name where the log originated */
  function?: string;
  /** User ID associated with the log entry */
  userId?: string;
  /** Session ID for tracking user sessions */
  sessionId?: string;
  /** Custom timestamp (auto-generated if not provided) */
  timestamp?: string;
  /** Additional custom context data */
  [key: string]: unknown;
}

/**
 * Configuration options for the logger
 * Controls logging behavior and output destinations
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  level: LogLevel;
  /** Whether to output to console (typically disabled in production) */
  enableConsole: boolean;
  /** Whether to send logs to remote logging service */
  enableRemoteLogging: boolean;
  /** Endpoint URL for remote logging service */
  remoteEndpoint?: string;
}

/**
 * Main Logger class
 * 
 * Provides centralized logging functionality with configurable output destinations
 * and log levels. Automatically adapts behavior based on environment.
 * 
 * @example
 * ```tsx
 * import { logger } from '@/lib/logger';
 * 
 * // Configure logging for development
 * logger.setConfig({ level: LogLevel.DEBUG, enableConsole: true });
 * 
 * // Log with context
 * logger.info('Component mounted', { component: 'UserProfile', userId: '123' });
 * ```
 */
class Logger {
  private config: LoggerConfig;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.config = {
      level: this.isProduction ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: !this.isProduction,
      enableRemoteLogging: this.isProduction,
      remoteEndpoint: process.env.NEXT_PUBLIC_LOGGING_ENDPOINT,
    };
  }

  /**
   * Set logging configuration
   * 
   * Allows runtime configuration of logging behavior. Useful for adjusting
   * log levels or enabling/disabling features based on user preferences
   * or application state.
   * 
   * @param config - Partial configuration to merge with existing settings
   * 
   * @example
   * ```tsx
   * // Enable debug logging temporarily
   * logger.setConfig({ level: LogLevel.DEBUG });
   * 
   * // Disable remote logging for testing
   * logger.setConfig({ enableRemoteLogging: false });
   * ```
   */
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current log level
   * 
   * @returns The current minimum log level for output
   * 
   * @example
   * ```tsx
   * if (logger.getLevel() <= LogLevel.DEBUG) {
   *   // Perform expensive debug operations
   *   logger.debug('Expensive debug info', expensiveData);
   * }
   * ```
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Check if a log level should be output
   * 
   * @param level - The log level to check
   * @returns True if the level should be logged, false otherwise
   * 
   * @private
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Format log message with context
   * 
   * Creates a standardized log message format that includes timestamp,
   * log level, message, and structured context data.
   * 
   * @param level - The log level for the message
   * @param message - The main log message
   * @param context - Optional context data to include
   * @returns Formatted log message string
   * 
   * @private
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
    
    return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
  }

  /**
   * Send log to remote logging service
   * 
   * Attempts to send log entries to a remote logging service for
   * centralized log collection and analysis. Falls back to console
   * if remote logging fails.
   * 
   * @param level - The log level
   * @param message - The log message
   * @param context - Optional context data
   * 
   * @private
   */
  private async sendToRemote(level: LogLevel, message: string, context?: LogContext): Promise<void> {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          message,
          context,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      if (this.config.enableConsole) {
        console.error("Failed to send log to remote service:", error);
      }
    }
  }

  /**
   * Log debug message
   * 
   * Used for detailed debugging information that is typically only
   * needed during development or troubleshooting.
   * 
   * @param message - The debug message
   * @param context - Optional context data
   * 
   * @example
   * ```tsx
   * logger.debug('Component state updated', { 
   *   component: 'UserForm', 
   *   previousState: oldState, 
   *   newState: currentState 
   * });
   * ```
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context);
    
    if (this.config.enableConsole) {
      console.debug(formattedMessage);
    }
    
    this.sendToRemote(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   * 
   * Used for general information about application flow, user actions,
   * and important state changes.
   * 
   * @param message - The info message
   * @param context - Optional context data
   * 
   * @example
   * ```tsx
   * logger.info('User authentication successful', { 
   *   userId: user.id, 
   *   method: 'password',
   *   timestamp: new Date().toISOString() 
   * });
   * ```
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const formattedMessage = this.formatMessage(LogLevel.INFO, message, context);
    
    if (this.config.enableConsole) {
      console.info(formattedMessage);
    }
    
    this.sendToRemote(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   * 
   * Used for situations that are not errors but may indicate
   * potential problems or deprecated usage patterns.
   * 
   * @param message - The warning message
   * @param context - Optional context data
   * 
   * @example
   * ```tsx
   * logger.warn('Deprecated API endpoint used', { 
   *   endpoint: '/api/v1/users', 
   *   suggestedEndpoint: '/api/v2/users',
   *   component: 'UserService' 
   * });
   * ```
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formattedMessage = this.formatMessage(LogLevel.WARN, message, context);
    
    if (this.config.enableConsole) {
      console.warn(formattedMessage);
    }
    
    this.sendToRemote(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   * 
   * Used for errors that may affect application functionality.
   * Automatically captures error details including stack traces.
   * 
   * @param message - The error message
   * @param error - The error object or additional error information
   * @param context - Optional context data
   * 
   * @example
   * ```tsx
   * try {
   *   await fetchUserData(userId);
   * } catch (err) {
   *   logger.error('Failed to fetch user data', err, { 
   *     userId, 
   *     component: 'UserProfile',
   *     attempt: retryCount 
   *   });
   * }
   * ```
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, errorContext);
    
    if (this.config.enableConsole) {
      console.error(formattedMessage);
    }
    
    this.sendToRemote(LogLevel.ERROR, message, errorContext);
  }

  /**
   * Log table data (development only)
   * 
   * Outputs tabular data in a readable format. Only available
   * in development mode and when console logging is enabled.
   * 
   * @param data - The data to display in table format
   * @param context - Optional context data
   * 
   * @example
   * ```tsx
   * logger.table(userPermissions, { 
   *   component: 'PermissionManager',
   *   userId: currentUser.id 
   * });
   * ```
   */
  table(data: unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG) || !this.config.enableConsole) return;
    
    console.table(data);
    this.sendToRemote(LogLevel.DEBUG, "Table data logged", context);
  }

  /**
   * Group related log messages
   * 
   * Creates a collapsible group in the console for organizing
   * related log messages. Only available in development mode.
   * 
   * @param label - The label for the log group
   * @param context - Optional context data for the group
   * 
   * @example
   * ```tsx
   * logger.group('User Authentication Flow', { userId: '123' });
   * logger.info('Starting authentication');
   * logger.info('Validating credentials');
   * logger.info('Authentication successful');
   * logger.groupEnd();
   * ```
   */
  group(label: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG) || !this.config.enableConsole) return;
    
    console.group(label);
    if (context) {
      this.debug("Group context", context);
    }
  }

  /**
   * End log group
   * 
   * Closes the currently open log group. Should be called
   * after each call to `group()` to maintain proper nesting.
   * 
   * @example
   * ```tsx
   * logger.group('API Request');
   * // ... log messages ...
   * logger.groupEnd(); // Close the group
   * ```
   */
  groupEnd(): void {
    if (!this.shouldLog(LogLevel.DEBUG) || !this.config.enableConsole) return;
    
    console.groupEnd();
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const debug = (message: string, context?: LogContext) => logger.debug(message, context);
export const info = (message: string, context?: LogContext) => logger.info(message, context);
export const warn = (message: string, context?: LogContext) => logger.warn(message, context);
export const error = (message: string, error?: Error | unknown, context?: LogContext) => logger.error(message, error, context);
export const table = (data: unknown, context?: LogContext) => logger.table(data, context);
export const group = (label: string, context?: LogContext) => logger.group(label, context);
export const groupEnd = () => logger.groupEnd(); 