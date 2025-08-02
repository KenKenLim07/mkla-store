// logger.ts - Production-ready logging utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
  timestamp?: string
  [key: string]: any
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'warn'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      level,
      message,
      timestamp,
      ...context
    }

    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m'  // Red
      }
      const reset = '\x1b[0m'
      
      console.log(
        `${colors[level]}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`,
        context ? context : ''
      )
      return
    }

    // In production, structured logging
    if (this.shouldLog(level)) {
      console.log(JSON.stringify(logEntry))
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.logLevel)
  }

  debug(message: string, context?: LogContext): void {
    this.formatMessage('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.formatMessage('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.formatMessage('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error ? {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      ...context
    } : context

    this.formatMessage('error', message, errorContext)
  }

  // Special method for API errors
  apiError(endpoint: string, error: Error, context?: LogContext): void {
    this.error(`API Error at ${endpoint}`, error, {
      endpoint,
      ...context
    })
  }

  // Special method for authentication errors
  authError(action: string, error: Error, context?: LogContext): void {
    this.error(`Auth Error during ${action}`, error, {
      action,
      ...context
    })
  }
}

// Create singleton instance
export const logger = new Logger()

// Convenience functions for common patterns
export const logApiCall = (endpoint: string, method: string) => {
  logger.debug(`API Call: ${method} ${endpoint}`)
}

export const logApiSuccess = (endpoint: string, method: string, duration?: number) => {
  logger.debug(`API Success: ${method} ${endpoint}`, { duration })
}

export const logApiError = (endpoint: string, method: string, error: Error) => {
  logger.apiError(`${method} ${endpoint}`, error)
}

export const logUserAction = (action: string, userId?: string) => {
  logger.info(`User Action: ${action}`, { userId })
}

export const logPerformance = (action: string, duration: number) => {
  if (duration > 1000) { // Log slow operations
    logger.warn(`Slow operation: ${action}`, { duration })
  } else {
    logger.debug(`Performance: ${action}`, { duration })
  }
}