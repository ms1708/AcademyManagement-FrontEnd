import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface for error log entry
 */
export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Interface for daily error log file
 */
export interface DailyErrorLog {
  date: string; // YYYY-MM-DD format
  entries: ErrorLogEntry[];
  totalCount: number;
  errorCount: number;
  warningCount: number;
}

/**
 * Service for managing frontend error logging
 * Stores errors locally and provides admin interface for viewing/downloading logs
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
      private readonly STORAGE_KEY = 'app_error_logs';
  private readonly MAX_LOG_ENTRIES = 1000; // Maximum entries to keep
  private readonly MAX_DAILY_ENTRIES = 100; // Maximum entries per day
  
  private logsSubject = new BehaviorSubject<DailyErrorLog[]>([]);
  public logs$ = this.logsSubject.asObservable();

  constructor() {
    this.initializeLogging();
    this.loadLogsFromStorage();
  }

  /**
   * Initializes global error handling
   */
  private initializeLogging(): void {
    if (!environment.enableErrorLogging) {
      return;
    }

    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('error', event.error?.message || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('error', event.reason?.message || 'Unknown promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  /**
   * Logs an error entry
   * @param level - Log level
   * @param message - Error message
   * @param additionalData - Additional error data
   */
  logError(level: 'error' | 'warn' | 'info' | 'debug', message: string, additionalData?: Record<string, unknown>): void {
    if (!environment.enableErrorLogging) {
      return;
    }

    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalData
    };

    // Add stack trace for errors
    if (level === 'error' && additionalData?.['stack']) {
      logEntry.stack = additionalData['stack'] as string;
    }

    this.addLogEntry(logEntry);
  }

  /**
   * Logs an error with automatic stack trace capture
   * @param message - Error message
   * @param error - Error object
   * @param additionalData - Additional error data
   */
  logErrorWithStack(message: string, error?: Error, additionalData?: Record<string, unknown>): void {
    const stackData = {
      stack: error?.stack,
      name: error?.name,
      ...additionalData
    };

    this.logError('error', message, stackData);
  }

  /**
   * Wraps async operations with error logging
   * @param operation - Async operation to wrap
   * @param context - Context description for the operation
   * @returns Promise with error logging
   */
  async wrapAsyncOperation<T>(operation: () => Promise<T>, context: string): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logErrorWithStack(`Failed to execute: ${context}`, error as Error);
      throw error;
    }
  }

  /**
   * Gets logs for a specific date
   * @param date - Date string in YYYY-MM-DD format
   * @returns Observable of daily error log
   */
  getLogsForDate(date: string): Observable<DailyErrorLog | null> {
    const logs = this.logsSubject.value;
    const dailyLog = logs.find(log => log.date === date);
    return new Observable(observer => observer.next(dailyLog || null));
  }

  /**
   * Gets all available log dates
   * @returns Array of date strings
   */
  getAvailableDates(): string[] {
    return this.logsSubject.value.map(log => log.date).sort().reverse();
  }

  /**
   * Downloads logs for a specific date as a file
   * @param date - Date string in YYYY-MM-DD format
   */
  downloadLogsForDate(date: string): void {
    const logs = this.logsSubject.value;
    const dailyLog = logs.find(log => log.date === date);

    if (!dailyLog) {
      console.warn(`No logs found for date: ${date}`);
      return;
    }

    const logContent = this.formatLogsForDownload(dailyLog);
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Clears logs for a specific date
   * @param date - Date string in YYYY-MM-DD format
   */
  clearLogsForDate(date: string): void {
    const logs = this.logsSubject.value.filter(log => log.date !== date);
    this.logsSubject.next(logs);
    this.saveLogsToStorage();
  }

  /**
   * Clears all logs
   */
  clearAllLogs(): void {
    this.logsSubject.next([]);
    this.saveLogsToStorage();
  }

  /**
   * Adds a log entry to the current day's logs
   * @param entry - Error log entry
   */
  private addLogEntry(entry: ErrorLogEntry): void {
    const currentDate = this.formatDate(entry.timestamp);
    const logs = [...this.logsSubject.value];
    
    let dailyLog = logs.find(log => log.date === currentDate);
    
    if (!dailyLog) {
      dailyLog = {
        date: currentDate,
        entries: [],
        totalCount: 0,
        errorCount: 0,
        warningCount: 0
      };
      logs.push(dailyLog);
    }

    // Add entry and update counts
    dailyLog.entries.unshift(entry); // Add to beginning (most recent first)
    dailyLog.totalCount++;
    
    if (entry.level === 'error') {
      dailyLog.errorCount++;
    } else if (entry.level === 'warn') {
      dailyLog.warningCount++;
    }

    // Limit entries per day
    if (dailyLog.entries.length > this.MAX_DAILY_ENTRIES) {
      dailyLog.entries = dailyLog.entries.slice(0, this.MAX_DAILY_ENTRIES);
    }

    // Limit total days
    if (logs.length > 30) { // Keep last 30 days
      logs.sort((a, b) => b.date.localeCompare(a.date));
      logs.splice(30);
    }

    this.logsSubject.next(logs);
    this.saveLogsToStorage();
  }

  /**
   * Formats logs for download
   * @param dailyLog - Daily error log
   * @returns Formatted log content
   */
  private formatLogsForDownload(dailyLog: DailyErrorLog): string {
    const header = `Error Logs for ${dailyLog.date}
Generated on: ${new Date().toISOString()}
Total Entries: ${dailyLog.totalCount}
Errors: ${dailyLog.errorCount}
Warnings: ${dailyLog.warningCount}

${'='.repeat(80)}

`;

    const logContent = dailyLog.entries.map(entry => {
      return `[${entry.timestamp.toISOString()}] ${entry.level.toUpperCase()}: ${entry.message}
URL: ${entry.url}
User Agent: ${entry.userAgent}
${entry.stack ? `Stack Trace:\n${entry.stack}` : ''}
${entry.additionalData ? `Additional Data: ${JSON.stringify(entry.additionalData, null, 2)}` : ''}
${'-'.repeat(80)}`;
    }).join('\n\n');

    return header + logContent;
  }

  /**
   * Formats date to YYYY-MM-DD string
   * @param date - Date object
   * @returns Formatted date string
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Generates unique ID for log entries
   * @returns Unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Loads logs from local storage
   */
  private loadLogsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const logs = JSON.parse(stored).map((log: Record<string, unknown>) => ({
          ...log,
          entries: ((log['entries'] as Record<string, unknown>[]) || []).map((entry: Record<string, unknown>) => ({
            ...entry,
            timestamp: new Date(entry['timestamp'] as string)
          }))
        }));
        this.logsSubject.next(logs);
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }

  /**
   * Saves logs to local storage
   */
  private saveLogsToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logsSubject.value));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }
}
