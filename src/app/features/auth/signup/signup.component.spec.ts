import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SignupComponent } from './signup.component';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockErrorLoggingService: jasmine.SpyObj<ErrorLoggingService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockErrorLoggingService = jasmine.createSpyObj('ErrorLoggingService', ['logError', 'logErrorWithStack']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ErrorLoggingService, useValue: mockErrorLoggingService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with empty form', () => {
      expect(component.signupForm.get('firstName')?.value).toBe('');
      expect(component.signupForm.get('lastName')?.value).toBe('');
      expect(component.signupForm.get('email')?.value).toBe('');
      expect(component.signupForm.get('phoneNumber')?.value).toBe('');
      expect(component.signupForm.get('password')?.value).toBe('');
      expect(component.signupForm.get('confirmPassword')?.value).toBe('');
      expect(component.signupForm.get('acceptTerms')?.value).toBe(false);
    });

    it('should be invalid when form is empty', () => {
      expect(component.signupForm.valid).toBeFalsy();
    });

    it('should validate email format', () => {
      const emailControl = component.signupForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate password requirements', () => {
      const passwordControl = component.signupForm.get('password');
      
      // Test minimum length
      passwordControl?.setValue('short');
      expect(passwordControl?.hasError('minLength')).toBeTruthy();
      
      // Test no number or symbol
      passwordControl?.setValue('longpassword');
      expect(passwordControl?.hasError('noNumberOrSymbol')).toBeTruthy();
      
      // Valid password
      passwordControl?.setValue('validPassword123');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate password confirmation', () => {
      component.signupForm.patchValue({
        password: 'password123',
        confirmPassword: 'different123'
      });
      
      expect(component.signupForm.hasError('passwordMismatch')).toBeTruthy();
      
      component.signupForm.patchValue({
        confirmPassword: 'password123'
      });
      
      expect(component.signupForm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('should validate phone number format', () => {
      const phoneControl = component.signupForm.get('phoneNumber');
      
      phoneControl?.setValue('123');
      expect(phoneControl?.hasError('pattern')).toBeTruthy();
      
      phoneControl?.setValue('1234567890');
      expect(phoneControl?.valid).toBeTruthy();
    });

    it('should require terms acceptance', () => {
      const termsControl = component.signupForm.get('acceptTerms');
      
      expect(termsControl?.hasError('required')).toBeTruthy();
      
      termsControl?.setValue(true);
      expect(termsControl?.valid).toBeTruthy();
    });
  });

  describe('Password Requirements', () => {
    it('should update password requirements on password change', () => {
      const passwordControl = component.signupForm.get('password');
      
      passwordControl?.setValue('weak');
      expect(component.passwordRequirements.length).toBeFalsy();
      expect(component.passwordRequirements.hasNumberOrSymbol).toBeFalsy();
      
      passwordControl?.setValue('strongPassword123!');
      expect(component.passwordRequirements.length).toBeTruthy();
      expect(component.passwordRequirements.hasNumberOrSymbol).toBeTruthy();
    });

    it('should check for personal info in password', () => {
      component.signupForm.patchValue({
        firstName: 'John',
        email: 'john@example.com',
        password: 'johnpassword123'
      });
      
      expect(component.passwordRequirements.noPersonalInfo).toBeFalsy();
      
      component.signupForm.patchValue({
        password: 'securePassword123!'
      });
      
      expect(component.passwordRequirements.noPersonalInfo).toBeTruthy();
    });

    it('should return correct password strength', () => {
      component.passwordRequirements = {
        length: false,
        noPersonalInfo: false,
        hasNumberOrSymbol: false
      };
      expect(component.getPasswordStrength()).toBe('Very Weak');
      
      component.passwordRequirements = {
        length: true,
        noPersonalInfo: true,
        hasNumberOrSymbol: true
      };
      expect(component.getPasswordStrength()).toBe('Strong');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Fill form with valid data
      component.signupForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'securePassword123!',
        confirmPassword: 'securePassword123!',
        acceptTerms: true
      });
    });

    it('should call AuthService register on valid form submission', () => {
      mockAuthService.register.and.returnValue(of({ success: true }));
      
      component.onSubmit();
      
      expect(mockAuthService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'securePassword123!'
      });
    });

    it('should navigate to verification on successful registration', () => {
      mockAuthService.register.and.returnValue(of({ success: true }));
      
      component.onSubmit();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/verification']);
    });

    it('should handle registration error', () => {
      const error = new Error('Registration failed');
      mockAuthService.register.and.returnValue(throwError(() => error));
      
      component.onSubmit();
      
      expect(mockErrorLoggingService.logErrorWithStack).toHaveBeenCalledWith('Registration failed', error);
      expect(component.isLoading).toBeFalsy();
    });

    it('should not submit invalid form', () => {
      component.signupForm.patchValue({
        email: 'invalid-email'
      });
      
      component.onSubmit();
      
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to sign in page', () => {
      component.navigateToSignIn();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/signin']);
    });
  });

  describe('Field Validation Helpers', () => {
    it('should check if field is invalid', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('invalid');
      emailControl?.markAsTouched();
      
      expect(component.isFieldInvalid('email')).toBeTruthy();
    });

    it('should get field error message', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      
      expect(component.getFieldError('email')).toBe('Email is required');
      
      emailControl?.setValue('invalid');
      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    });
  });
});
