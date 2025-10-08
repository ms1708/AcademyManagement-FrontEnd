import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss'
})
export class CreatePasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);

  isLoading = false;

  createPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  constructor() {}

  private passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.createPasswordForm.valid) {
      this.isLoading = true;
      const { password } = this.createPasswordForm.value;
      
      // In a real app, call auth service to reset password
      console.log('Creating new password...');
      this.errorLoggingService.logError('info', 'Password reset completed successfully');
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        alert('Password created successfully!');
        this.navigateToSignIn();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  onSkip(): void {
    this.navigateToSignIn();
  }

  private navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.createPasswordForm.controls).forEach(key => {
      const control = this.createPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.createPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
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
