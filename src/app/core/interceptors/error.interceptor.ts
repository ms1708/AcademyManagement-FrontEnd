import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLoggingService } from '../services/error-logging.service';

/**
 * HTTP interceptor function for handling errors globally
 * Automatically logs HTTP errors to the error logging service
 */
export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const errorLoggingService = new ErrorLoggingService(); // Simple instantiation for now
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, errorLoggingService);
      return throwError(() => error);
    })
  );
}

/**
 * Handles HTTP errors
 * @param error - HTTP error response
 * @param errorLoggingService - Error logging service instance
 */
function handleError(error: HttpErrorResponse, errorLoggingService: ErrorLoggingService): void {
  let errorMessage = 'An unknown error occurred';
  let errorLevel: 'debug' | 'error' | 'warn' | 'info' = 'error';
  const errorDetails = {
    url: error.url,
    status: error.status,
    statusText: error.statusText,
    timestamp: new Date().toISOString()
  };

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = error.error.message;
    errorLevel = 'error';
  } else {
    // Server-side error
    errorMessage = error.message || `HTTP Error ${error.status}: ${error.statusText}`;
    
    if (error.status >= 500) {
      errorLevel = 'error';
    } else if (error.status >= 400) {
      errorLevel = 'warn';
    }

    // Log the main error
    errorLoggingService.logError(errorLevel, errorMessage, errorDetails);

    // Log individual validation errors if they exist
    if (error.error && error.error.errors) {
      logValidationErrors(error, errorLevel, errorDetails, errorLoggingService);
    }
  }

  // Always log the main error
  errorLoggingService.logError(errorLevel, errorMessage, errorDetails);
}

/**
 * Logs validation errors individually
 * @param error - HTTP error response
 * @param errorLevel - Error level
 * @param errorDetails - Error details
 * @param errorLoggingService - Error logging service instance
 */
function logValidationErrors(error: HttpErrorResponse, errorLevel: 'debug' | 'error' | 'warn' | 'info', errorDetails: Record<string, unknown>, errorLoggingService: ErrorLoggingService): void {
  if (error.error.errors && Array.isArray(error.error.errors)) {
    error.error.errors.forEach((err: string) => {
      errorLoggingService.logError(errorLevel, err, errorDetails);
    });
  }
}