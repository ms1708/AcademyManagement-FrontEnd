import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Interface for API response structure
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Base API service for handling HTTP requests to .NET Core backend
 * Provides common HTTP operations with error handling, retry logic, and timeout
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly retryAttempts = 0;

  constructor() {
    this.baseUrl = environment.apiUrl;
    this.defaultTimeout = environment.apiTimeout;
  }

  /**
   * Performs a GET request
   * @param endpoint - API endpoint (relative to base URL)
   * @param params - Query parameters
   * @param timeoutMs - Request timeout in milliseconds
   * @returns Observable of API response
   */
  get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    timeoutMs?: number
  ): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const httpParams = this.buildHttpParams(params);
    const timeoutValue = timeoutMs || this.defaultTimeout;

    return this.http
      .get<ApiResponse<T>>(url, { params: httpParams })
      .pipe(
        timeout(timeoutValue),
        retry(this.retryAttempts),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Performs a POST request
   * @param endpoint - API endpoint (relative to base URL)
   * @param data - Request body data
   * @param timeoutMs - Request timeout in milliseconds
   * @returns Observable of API response
   */
  post<T>(
    endpoint: string,
    data: unknown,
    options?: {
      httpOptions?: { headers?: HttpHeaders; params?: HttpParams; [key: string]: any };
      timeoutMs?: number;
    }
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const timeoutValue = options?.timeoutMs || this.defaultTimeout;

    const httpOptions = {
      ...this.getDefaultHeaders(),
      ...(options?.httpOptions || {}),
    };

    return this.http
      .post<T>(url, data, httpOptions)
      .pipe(
        timeout(timeoutValue),
        retry(this.retryAttempts),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Performs a PUT request
   * @param endpoint - API endpoint (relative to base URL)
   * @param data - Request body data
   * @param timeoutMs - Request timeout in milliseconds
   * @returns Observable of API response
   */
  put<T>(endpoint: string, data: unknown, timeoutMs?: number): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const timeoutValue = timeoutMs || this.defaultTimeout;

    return this.http
      .put<ApiResponse<T>>(url, data, this.getDefaultHeaders())
      .pipe(
        timeout(timeoutValue),
        retry(this.retryAttempts),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Performs a DELETE request
   * @param endpoint - API endpoint (relative to base URL)
   * @param timeoutMs - Request timeout in milliseconds
   * @returns Observable of API response
   */
  delete<T>(endpoint: string, timeoutMs?: number): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const timeoutValue = timeoutMs || this.defaultTimeout;

    return this.http
      .delete<ApiResponse<T>>(url, this.getDefaultHeaders())
      .pipe(
        timeout(timeoutValue),
        retry(this.retryAttempts),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Downloads a file from the API
   * @param endpoint - API endpoint (relative to base URL)
   * @returns Observable of blob data
   */
  downloadFile(endpoint: string): Observable<Blob> {
    const url = `${this.baseUrl}/${endpoint}`;

    return this.http
      .get(url, {
        responseType: 'blob',
        headers: this.getDefaultHeaders().headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Builds HTTP parameters from object
   * @param params - Parameters object
   * @returns HttpParams object
   */
  private buildHttpParams(params?: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Gets default HTTP headers
   * @returns HTTP options with default headers
   */
  private getDefaultHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };
  }

  /**
   * Handles HTTP errors
   * @param error - HTTP error response
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Service Error:', errorMessage, error);

    return throwError(() => error);
  }
}
