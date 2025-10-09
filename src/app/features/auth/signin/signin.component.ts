import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';
import Swal from 'sweetalert2';
import { OnboardingDataService } from '../../onboarding/OnboardingDataService';
import { AuthenticationService } from '../../../core/services/signin.service';

/**
 * Sign-in component for user authentication
 * Implements the new design with custom styling to match Figma design
 */
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);
  private onboardingService = inject(OnboardingDataService);
  private authenticationService = inject(AuthenticationService);

  signinForm: FormGroup;
  isLoading = false;

  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.signinForm.valid) {
      this.isLoading = true;
      const { email, password } = this.signinForm.value;

      this.authService.login({ email, password }).subscribe({
        next: res => {
          this.isLoading = false;
          this.errorLoggingService.logError('info', `User signed in successfully: ${email}`);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back!',
          });
          this.onboardingService.setUserData(res.user);
          this.onboardingService.setUserId(res.user.id);
          if (!res.isSignInComplete) {
            this.router.navigate(['/onboarding/step1']);
          }
          // Redirect to dashboard or intended page
          else this.router.navigate(['/dashboard']);
        },
        error: error => {
          this.isLoading = false;
          console.error('Login Error:', error);

          // Ensure error object is defined and has response
          const err = error?.error;

          if (!err.isUserExist) {
            Swal.fire({
              icon: 'error',
              title: 'User Not Found',
              text: 'No account exists with this email. Please sign up first.',
              confirmButtonColor: '#3085d6',
            });
          } else if (err.isUserExist && err.isEmailVerifed) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid Credentials',
              text: 'The password you entered is incorrect. Please try again.',
              confirmButtonColor: '#3085d6',
            });
          } else if (!err.isEmailVerifed) {
            Swal.fire({
              icon: 'warning',
              title: 'Email Not Verified',
              text: 'Please verify your email before signing in.',
              showCancelButton: true,
              confirmButtonText: 'Verify Email',
              cancelButtonText: 'Cancel',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then(result => {
              if (result.isConfirmed) {
                this.authenticationService.resendOtp(email).subscribe({
                  next: () => {
                    console.log(`OTP resent to ${email}`);
                    this.router.navigate(['/auth/verify-email'], {
                      state: {
                        email: email,
                     userid: err.user.id,
                      },
                    });
                  },
                  error: err => {
                    console.error('Failed to resend OTP', err);
                  },
                });
              }
            });
          }
          this.errorLoggingService.logErrorWithStack('Sign-in failed', error as Error);
          // Handle error (show error message)
          console.error('Sign-in error:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
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

  /**
   * Gets the display label for a form field
   * @param fieldName - Name of the form field
   * @returns Display label string
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Navigates to sign up page
   */
  navigateToSignUp(): void {
    this.router.navigate(['/auth/signup']);
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.signinForm.controls).forEach(key => {
      const control = this.signinForm.get(key);
      control?.markAsTouched();
    });
  }
}
