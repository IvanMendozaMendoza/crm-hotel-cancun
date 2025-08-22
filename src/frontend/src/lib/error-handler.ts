// Global error handling utilities

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private isProcessing = false;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(
        new Error(event.reason?.message || "Unhandled promise rejection"),
        {
          componentStack: "Global Promise Rejection",
        }
      );
    });

    // Handle global JavaScript errors
    window.addEventListener("error", (event) => {
      this.handleError(event.error || new Error(event.message), {
        componentStack: "Global JavaScript Error",
      });
    });
  }

  public handleError(error: Error, errorInfo?: Partial<ErrorInfo>) {
    const errorInfoComplete: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getUserId(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorHandler:", errorInfoComplete);
    }

    // Add to queue for processing
    this.errorQueue.push(errorInfoComplete);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.errorQueue.length > 0) {
        const error = this.errorQueue.shift();
        if (error) {
          await this.sendErrorToMonitoringService(error);
        }
      }
    } catch (processingError) {
      console.error("Error processing error queue:", processingError);
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendErrorToMonitoringService(errorInfo: ErrorInfo) {
    try {
      // In production, you would send this to your error monitoring service
      // e.g., Sentry, LogRocket, Bugsnag, etc.
      if (process.env.NODE_ENV === "production") {
        // Example: Send to your API endpoint
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorInfo)
        // });

        // For now, just log to console
        console.error("Error sent to monitoring service:", errorInfo);
      }
    } catch (sendError) {
      console.error("Failed to send error to monitoring service:", sendError);
    }
  }

  private getUserId(): string | undefined {
    // Get user ID from your auth context or session
    // This is just an example - implement based on your auth system
    try {
      // You might get this from localStorage, sessionStorage, or context
      return localStorage.getItem("userId") || undefined;
    } catch {
      return undefined;
    }
  }

  public getErrorCount(): number {
    return this.errorQueue.length;
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions
export const logError = (error: Error, context?: string) => {
  errorHandler.handleError(error, {
    componentStack: context || "Manual Error Log",
  });
};

export const logErrorWithContext = (
  error: Error,
  componentName: string,
  props?: Record<string, unknown>
) => {
  errorHandler.handleError(error, {
    componentStack: `${componentName}${
      props ? ` - Props: ${JSON.stringify(props)}` : ""
    }`,
  });
};
