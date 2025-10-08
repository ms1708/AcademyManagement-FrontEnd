import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Create Password Component
 * Final step in the forgot password flow where users create a new password
 * after verifying their email with OTP
 */
@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss'
})
export class CreatePasswordComponent {
  // Inject services using modern Angular inject() function
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);

  // Track loading state for button disable/enable
  isLoading = false;

  // Form with password and confirmation, includes custom validator for matching
  createPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  constructor() {}

  // Custom validator to ensure password and confirmation match
  private passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    // Check if passwords don't match
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Clear password mismatch error if passwords now match
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.createPasswordForm.valid) {
      this.isLoading = true;
      const { password } = this.createPasswordForm.value;
      
      // TODO: Replace with actual API call to reset password
      console.log('Creating new password...');
      this.errorLoggingService.logError('info', 'Password reset completed successfully');
      
      // Simulated API response - remove when backend is ready
      setTimeout(() => {
        this.isLoading = false;
        alert('Password created successfully!');
        this.navigateToSignIn();
      }, 2000);
    } else {
      // Show validation errors if form is invalid
      this.markFormGroupTouched();
    }
  }

  // Allow users to skip password creation and return to login
  onSkip(): void {
    this.navigateToSignIn();
  }

  // Navigate back to sign in page
  private navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  // Trigger validation display on all fields
  private markFormGroupTouched(): void {
    Object.keys(this.createPasswordForm.controls).forEach(key => {
      const control = this.createPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Check if a specific field has validation errors
  isFieldInvalid(fieldName: string): boolean {
    const field = this.createPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get user-friendly error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.createPasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['minlength']) {
        return 'Password must be at least 8 characters long';
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}
