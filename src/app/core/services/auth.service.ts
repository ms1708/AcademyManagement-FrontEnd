import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorLoggingService } from './error-logging.service';
import { User, LoginRequest, LoginResponse, RegisterRequest, UpdateProfileRequest, UserRole } from '../models/user.model';

/**
 * Authentication Service
 * Manages user authentication state, tokens, and API interactions
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private errorLoggingService = inject(ErrorLoggingService);

  // Local storage keys for auth data
  private readonly TOKEN_KEY = 'app_token';
  private readonly USER_KEY = 'app_user';
  private readonly REFRESH_TOKEN_KEY = 'app_refresh_token';

  // Observable streams for reactive state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  // Check stored token on app startup
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

  // Authenticate user with email and password
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials)
      .pipe(
        map(response => response.data),
        tap(response => {
          this.setAuthData(response);
          this.errorLoggingService.logError('info', `User logged in: ${response.user.email}`);
        }),
        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Login failed', error as Error, credentials);
          throw error;
        })
      );
  }

  // Create new user account
  register(userData: RegisterRequest): Observable<User> {
    return this.apiService.post<User>('auth/register', userData)
      .pipe(
        map(response => response.data),
        tap(user => {
          this.errorLoggingService.logError('info', `User registered: ${user.email}`);
        }),
        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Registration failed', error as Error, userData);
          throw error;
        })
      );
  }

  // Log user out and clear session data
  logout(): void {
    const currentUser = this.currentUserSubject.value;
    
    if (currentUser) {
      this.errorLoggingService.logError('info', `User logged out: ${currentUser.email}`);
    }

    // Call logout endpoint
    this.apiService.post('auth/logout', {}).pipe(
      catchError(error => {
        // Continue logout even if API fails
        this.errorLoggingService.logError('warn', 'Logout API call failed', error);
        return of(null);
      })
    ).subscribe(() => {
      this.clearAuthData();
    });
  }

  // Get new access token using refresh token
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getStoredRefreshToken();
    
    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<LoginResponse>('auth/refresh', { refreshToken })
      .pipe(
        map(response => response.data),
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

  // Update user profile information
  updateProfile(updates: UpdateProfileRequest): Observable<User> {
    return this.apiService.put<User>('auth/profile', updates)
      .pipe(
        map(response => response.data),
        tap(updatedUser => {
          this.currentUserSubject.next(updatedUser);
          this.setStoredUser(updatedUser);
          this.errorLoggingService.logError('info', `Profile updated: ${updatedUser.email}`);
        }),
        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Profile update failed', error as Error, updates);
          throw error;
        })
      );
  }

  // Change user's password
  changePassword(currentPassword: string, newPassword: string): Observable<unknown> {
    return this.apiService.put('auth/change-password', {
      currentPassword,
      newPassword
    }).pipe(
      tap(() => {
        this.errorLoggingService.logError('info', 'Password changed successfully');
      }),
      catchError(error => {
        this.errorLoggingService.logErrorWithStack('Password change failed', error as Error);
        throw error;
      })
    );
  }

  // Send password reset email
  forgotPassword(email: string): Observable<unknown> {
    return this.apiService.post('auth/forgot-password', { email })
      .pipe(
        tap(() => {
          this.errorLoggingService.logError('info', `Password reset email sent to: ${email}`);
        }),
        catchError(error => {
          this.errorLoggingService.logErrorWithStack('Forgot password failed', error as Error, { email });
          throw error;
        })
      );
  }

  // Role-based access checks
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.ADMIN;
  }

  isInstructor(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.INSTRUCTOR;
  }

  isStudent(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.STUDENT;
  }

  // Get currently logged in user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Retrieve auth token from storage
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Retrieve refresh token from storage
  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Retrieve user data from storage
  getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Store authentication data after successful login
  private setAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  // Update stored user data
  private setStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Remove all auth data from storage
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Validate JWT token expiry
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
