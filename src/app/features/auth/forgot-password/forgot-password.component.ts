import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Forgot Password component for password reset functionality
 * Implements the design exactly as specified in Figma
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Handles form submission for password reset
   */
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.isLoading = false;
          this.errorLoggingService.logError('info', `Password reset email sent to: ${email}`);
          // Navigate to email verification or success page
          this.router.navigate(['/auth/verify-email'], { 
            queryParams: { type: 'reset', email: email } 
          });
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorLoggingService.logErrorWithStack('Password reset failed', error as Error);
          console.error('Password reset error:', error);
          // You might want to show an error message to the user here
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Navigates to sign in page (Skip functionality)
   */
  navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  /**
   * Checks if the email field is invalid and touched
   */
  isEmailInvalid(): boolean {
    const emailField = this.forgotPasswordForm.get('email');
    return !!(emailField && emailField.invalid && (emailField.dirty || emailField.touched));
  }

  /**
   * Gets the error message for the email field
   */
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

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
