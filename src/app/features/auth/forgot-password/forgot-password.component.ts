import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Forgot Password Component
 * First step in password reset flow - collects user's email address
 * and sends verification code
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  // Inject dependencies
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  // Form with email validation
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Send password reset request
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.isLoading = false;
          this.errorLoggingService.logError('info', `Password reset email sent to: ${email}`);
          // Move to OTP verification step
          this.router.navigate(['/auth/forgot-password-verify'], {
            queryParams: { type: 'reset', email: email },
          });
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorLoggingService.logErrorWithStack('Password reset failed', error as Error);
          console.error('Password reset error:', error);
          // TODO: Show user-friendly error message
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Navigate back to sign in page
  navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  // Check if email field has errors
  isEmailInvalid(): boolean {
    const emailField = this.forgotPasswordForm.get('email');
    return !!(emailField && emailField.invalid && (emailField.dirty || emailField.touched));
  }

  // Get appropriate error message for email field
  getEmailError(): string {
    const emailField = this.forgotPasswordForm.get('email');
    if (emailField && emailField.errors) {
      if (emailField.errors['required']) {
        return 'Email is required';
      }
      if (emailField.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  // Show validation errors on all fields
  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
