import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/signin.service';
import { OnboardingDataService } from '../../onboarding/OnboardingDataService';

/**
 * Email verification component for verifying user email with 6-digit code
 * Matches the design and styling of sign-in and sign-up pages
 */
@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent {
  verificationForm: FormGroup;
  isLoading = false;
  resendCooldown = 0;
  resendTimer: any;

  // Mock email for demonstration - in real app, this would come from route params or service
  userEmail: string = '';
  userId = '';
  errorMessage = '';
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);

  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private onboardingService = inject(OnboardingDataService);

  constructor() {
    this.verificationForm = this.fb.group({
      code1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code6: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    });
    const nav = this.router.getCurrentNavigation();
    this.userEmail = nav?.extras.state?.['email'] || '';
    this.userId = nav?.extras.state?.['userid'] || '';
    this.onboardingService.setUserId(this.userId);
    if (!this.userEmail || !this.userId) {
      this.router.navigate(['/auth/signup']);
    }
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      const otptext = this.getVerificationCode();
      const payload = {
        userid: this.userId, // set this when navigating from signup
        username: this.userEmail,
        otptext,
      };
      // Mock verification - in real app, call auth service
      // setTimeout(() => {
      //   this.isLoading = false;
      //   this.errorLoggingService.logError(
      //     'info',
      //     `Email verification attempted for: ${this.userEmail}`
      //   );
      //   // Redirect to onboarding step 1
      //   this.router.navigate(['/onboarding/step1']);
      // }, 2000);
      this.authenticationService.verifyOtp(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.errorMessage = ''; // clear any previous error

          this.errorLoggingService.logError('info', `OTP verified for: ${this.userEmail}`);
          // Navigate to dashboard or next step
          this.router.navigate(['/onboarding/step1']);
        },
        error: error => {
          this.isLoading = false;
          this.errorMessage = 'OTP is not matched. Please try again.';
          this.errorLoggingService.logErrorWithStack('OTP verification failed', error as Error);
          console.error('OTP verification error:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Handles resend code functionality
   */

  onResendCode(): void {
    if (this.resendCooldown > 0) return;

    this.resendCooldown = 60;
    this.startResendTimer();
    this.authenticationService.resendOtp(this.userEmail).subscribe({
      next: () => {
        console.log(`OTP resent to ${this.userEmail}`);
      },
      error: err => {
        console.error('Failed to resend OTP', err);
      },
    });
  }

  /**
   * Navigates back to sign up page
   */
  onBackToSignUp(): void {
    this.router.navigate(['/auth/signup']);
  }

  /**
   * Handles input changes for auto-focus to next field
   * @param event - Input event
   * @param nextFieldIndex - Index of next field to focus
   */
  onInputChange(event: Event, nextFieldIndex?: number): void {
    const input = event.target as HTMLInputElement;

    // Only allow single digit
    if (input.value.length > 1) {
      input.value = input.value.slice(-1);
    }

    // Auto-focus to next field
    if (input.value && nextFieldIndex !== undefined) {
      const nextField = document.getElementById(`code${nextFieldIndex + 1}`);
      if (nextField) {
        nextField.focus();
      }
    }

    // Update form control value
    const fieldName = `code${nextFieldIndex || parseInt(input.id.replace('code', ''))}`;
    this.verificationForm.get(fieldName)?.setValue(input.value);
  }

  /**
   * Handles backspace to focus previous field
   * @param event - Keyboard event
   * @param currentFieldIndex - Current field index
   */
  onBackspace(event: KeyboardEvent, currentFieldIndex: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && currentFieldIndex > 1) {
      const prevField = document.getElementById(`code${currentFieldIndex - 1}`);
      if (prevField) {
        prevField.focus();
      }
    }
  }

  /**
   * Gets the complete verification code
   * @returns Complete 6-digit code as string
   */
  private getVerificationCode(): string {
    const formValue = this.verificationForm.value;
    return `${formValue.code1}${formValue.code2}${formValue.code3}${formValue.code4}${formValue.code5}${formValue.code6}`;
  }

  /**
   * Starts the resend timer countdown
   */
  private startResendTimer(): void {
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.verificationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
  getFieldError(fieldName: string): string {
    const field = this.verificationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['pattern']) {
        return 'Please enter a single digit';
      }
    }
    return '';
  }

  /**
   * Checks if form is valid
   * @returns True if form is valid
   */
  isFormValid(): boolean {
    return this.verificationForm.valid;
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.verificationForm.controls).forEach(key => {
      const control = this.verificationForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }
}
