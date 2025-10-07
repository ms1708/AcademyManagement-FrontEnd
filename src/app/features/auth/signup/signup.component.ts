import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Sign-up component for user registration
 * Implements the new design with custom styling to match Figma design
 */
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  signupForm: FormGroup;
  isLoading = false;
  passwordRequirements = {
    length: false,
    noPersonalInfo: true,
    hasNumberOrSymbol: false
  };
  selectedCountryCode = '+27';
  countryFlag = '🇿🇦';

  constructor() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Watch password changes for requirements validation
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRequirements(password);
    });

    // Watch email and name changes for password validation
    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.updatePasswordRequirements(this.signupForm.get('password')?.value);
    });

    this.signupForm.get('firstName')?.valueChanges.subscribe(() => {
      this.updatePasswordRequirements(this.signupForm.get('password')?.value);
    });

    this.signupForm.get('lastName')?.valueChanges.subscribe(() => {
      this.updatePasswordRequirements(this.signupForm.get('password')?.value);
    });
  }

  /**
   * Custom validator for password requirements
   */
  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};

    // Check length
    if (password.length < 8) {
      errors['minLength'] = true;
    }

    // Check for number or symbol
    if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors['noNumberOrSymbol'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Updates password requirements status
   */
  private updatePasswordRequirements(password: string): void {
    if (!password) {
      this.passwordRequirements = {
        length: false,
        noPersonalInfo: true,
        hasNumberOrSymbol: false
      };
      return;
    }

    // Check length requirement
    this.passwordRequirements.length = password.length >= 8;

    // Check for personal info
    const firstName = this.signupForm.get('firstName')?.value?.toLowerCase() || '';
    const lastName = this.signupForm.get('lastName')?.value?.toLowerCase() || '';
    const email = this.signupForm.get('email')?.value?.toLowerCase() || '';
    const passwordLower = password.toLowerCase();

    this.passwordRequirements.noPersonalInfo =
      !firstName || !passwordLower.includes(firstName) &&
      !lastName || !passwordLower.includes(lastName) &&
      !email || !passwordLower.includes(email.split('@')[0]);

    // Check for number or symbol
    this.passwordRequirements.hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  /**
   * Gets password strength label
   */
  getPasswordStrength(): string {
    const requirementsMet = Object.values(this.passwordRequirements).filter(Boolean).length;
    
    if (requirementsMet === 0) return 'Very Weak';
    if (requirementsMet === 1) return 'Weak';
    if (requirementsMet === 2) return 'Fair';
    return 'Strong';
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const formData = {
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };

      this.authService.register(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.errorLoggingService.logError('info', `User registered successfully: ${formData.email}`);
          // Redirect to email verification page
          this.router.navigate(['/auth/verify-email']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorLoggingService.logErrorWithStack('Registration failed', error as Error);
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Navigates to sign in page
   */
  navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  /**
   * Checks if a form field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   */
  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
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
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  /**
   * Gets the display label for a form field
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Surname',
      email: 'Email',
      phoneNumber: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }
}
