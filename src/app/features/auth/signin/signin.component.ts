import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Sign In Component
 * Handles user authentication and login
 */
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  signinForm: FormGroup;
  isLoading = false;

  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle sign in form submission
  onSubmit(): void {
    if (this.signinForm.valid) {
      this.isLoading = true;
      const { email, password } = this.signinForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.isLoading = false;
          this.errorLoggingService.logError('info', `User signed in successfully: ${email}`);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorLoggingService.logErrorWithStack('Sign-in failed', error as Error);
          console.error('Sign-in error:', error);
          // TODO: Display error message to user
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Check if field has validation errors
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get validation error message for a field
  getFieldError(fieldName: string): string {
    const field = this.signinForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  // Get display name for a field
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  // Navigate to registration page
  navigateToSignUp(): void {
    this.router.navigate(['/auth/signup']);
  }

  // Navigate to password reset flow
  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  // Show validation errors on all form fields
  private markFormGroupTouched(): void {
    Object.keys(this.signinForm.controls).forEach(key => {
      const control = this.signinForm.get(key);
      control?.markAsTouched();
    });
  }
}
