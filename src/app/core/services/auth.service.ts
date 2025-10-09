import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorLoggingService } from './error-logging.service';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  UserRole,
} from '../models/user.model';

/**
 * Authentication service for managing user authentication state
 * Core functionality for API integration and token management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private errorLoggingService = inject(ErrorLoggingService);
  private baseUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'app_token';
  private readonly USER_KEY = 'app_user';
  private readonly REFRESH_TOKEN_KEY = 'app_refresh_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initializes authentication state from stored tokens
   */
  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user && this.isTokenValid(token)) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Logs in a user with email and password
   * @param credentials - Login credentials
   * @returns Observable of login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`Account/login`, credentials).pipe(
      map(response => response),
      tap(response => {
        this.setAuthData(response);
        this.errorLoggingService.logError('info', `User logged in: ${response.user.email}`);
      }),
      catchError(error => {
        this.errorLoggingService.logErrorWithStack('Login failed', error as Error);
        throw error;
      })
    );
  }

  /**
   * Registers a new user
   * @param userData - User registration data
   * @returns Observable of registration response
   */
  register(userData: RegisterRequest): Observable<User> {
    return this.apiService.post<User>('auth/register', userData).pipe(
      map(response => response),
      tap(user => {
        this.errorLoggingService.logError('info', `User registered: ${user.email}`);
      }),
      catchError(error => {
        this.errorLoggingService.logErrorWithStack('Registration failed', error as Error, userData);
        throw error;
      })
    );
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    const currentUser = this.currentUserSubject.value;

    if (currentUser) {
      this.errorLoggingService.logError('info', `User logged out: ${currentUser.email}`);
    }

    // Call logout API if needed
    this.apiService
      .post('auth/logout', {})
      .pipe(
        catchError(error => {
          // Continue with logout even if API call fails
          this.errorLoggingService.logError('warn', 'Logout API call failed', error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.clearAuthData();
      });
  }

  /**
   * Refreshes the authentication token
   * @returns Observable of new token response
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getStoredRefreshToken();

    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<LoginResponse>('auth/refresh', { refreshToken }).pipe(
      map(response => response),
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(error => {
        this.errorLoggingService.logErrorWithStack('Token refresh failed', error as Error);
        this.clearAuthData();
        throw error;
      })
    );
  }

  /**
   * Updates user profile
   * @param updates - Profile update data
   * @returns Observable of updated user
   */
  updateProfile(updates: UpdateProfileRequest): Observable<User> {
    return this.apiService.put<User>('auth/profile', updates).pipe(
      map(response => response.data),
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        this.setStoredUser(updatedUser);
        this.errorLoggingService.logError('info', `Profile updated: ${updatedUser.email}`);
      }),
      catchError(error => {
        this.errorLoggingService.logErrorWithStack(
          'Profile update failed',
          error as Error,
          updates
        );
        throw error;
      })
    );
  }

  /**
   * Changes user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Observable of success response
   */
  changePassword(currentPassword: string, newPassword: string): Observable<unknown> {
    return this.apiService
      .put('auth/change-password', {
        currentPassword,
        newPassword,
      })
      .pipe(
        tap(() => {
          this.errorLoggingService.logError('info', 'Password changed successfully');
        }),
        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Password change failed', error as Error);
          throw error;
        })
      );
  }

  //forget passwor
  forgotPassword(email: string): Observable<unknown> {
    return this.apiService
      .post('auth/forgot-password', { email })

      .pipe(
        tap(() => {
          this.errorLoggingService.logError('info', `Password reset email sent to: ${email}`);
        }),

        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Forgot password failed', error as Error, {
            email,
          });

          throw error;
        })
      );
  }
  /**
   * Checks if the current user has admin role
   * @returns True if user is admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.ADMIN;
  }

  /**
   * Checks if the current user has instructor role
   * @returns True if user is instructor
   */
  isInstructor(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.INSTRUCTOR;
  }

  /**
   * Checks if the current user has student role
   * @returns True if user is student
   */
  isStudent(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.STUDENT;
  }

  /**
   * Gets the current user
   * @returns Current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Gets the stored authentication token
   * @returns Token string or null
   */
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Gets the stored refresh token
   * @returns Refresh token string or null
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Gets the stored user data
   * @returns User object or null
   */
  getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Sets authentication data after successful login
   * @param response - Login response containing user and tokens
   */
  private setAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    //localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Sets stored user data
   * @param user - User object to store
   */
  private setStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clears all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Checks if a token is valid (not expired)
   * @param token - JWT token to validate
   * @returns True if token is valid
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}
