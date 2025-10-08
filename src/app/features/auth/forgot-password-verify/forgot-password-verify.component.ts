import { Component, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Forgot Password Verify Component
 * Handles OTP verification for password reset flow
 * Features auto-focus, paste support, and keyboard navigation
 */
@Component({
  selector: 'app-forgot-password-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password-verify.component.html',
  styleUrls: ['./forgot-password-verify.component.scss']
})
export class ForgotPasswordVerifyComponent implements OnInit {
  // Reference to all OTP input fields for focus management
  @ViewChildren('digit1,digit2,digit3,digit4,digit5') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // Store individual digits of the 5-digit verification code
  verificationCode: string[] = ['', '', '', '', ''];
  isLoading = false;
  email: string | null = null;
  verificationType: string | null = null; // 'email' or 'reset'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read email and verification type from URL query params
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.verificationType = params['type'] || 'email';
    });

    // Auto-focus first input for better UX
    setTimeout(() => {
      const firstInput = this.digitInputs?.first?.nativeElement;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  // Handle input in OTP fields
  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Only accept numeric digits
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      this.verificationCode[index] = '';
      return;
    }

    this.verificationCode[index] = value;

    // Move to next field automatically
    if (value && index < 4) {
      const nextInput = this.digitInputs.toArray()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Handle keyboard navigation and special keys
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Backspace: move to previous field if current is empty
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevInput = this.digitInputs.toArray()[index - 1]?.nativeElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    }
    
    // Arrow keys for navigation between fields
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = this.digitInputs.toArray()[index - 1]?.nativeElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    if (event.key === 'ArrowRight' && index < 4) {
      const nextInput = this.digitInputs.toArray()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Support pasting OTP code
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      this.handlePaste();
    }

    // Submit on Enter if code is complete
    if (event.key === 'Enter' && this.isCodeComplete()) {
      this.onVerify();
    }
  }

  // Handle pasted OTP codes from clipboard
  private handlePaste(): void {
    navigator.clipboard.readText().then(text => {
      const digits = text.replace(/\D/g, '').split('').slice(0, 5);
      if (digits.length > 0) {
        digits.forEach((digit, index) => {
          if (index < 5) {
            this.verificationCode[index] = digit;
            const input = this.digitInputs.toArray()[index]?.nativeElement;
            if (input) {
              input.value = digit;
            }
          }
        });
        
        // Focus next empty field or last field if all filled
        const nextEmptyIndex = this.verificationCode.findIndex(code => !code);
        const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
        const targetInput = this.digitInputs.toArray()[focusIndex]?.nativeElement;
        if (targetInput) {
          targetInput.focus();
        }
      }
    }).catch(err => {
      console.warn('Could not read clipboard contents: ', err);
    });
  }

  // Check if all 5 digits are entered
  isCodeComplete(): boolean {
    return this.verificationCode.every(digit => digit !== '');
  }

  // Verify the entered OTP code
  onVerify(): void {
    if (!this.isCodeComplete() || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const code = this.verificationCode.join('');

    // TODO: Replace with actual API verification
    setTimeout(() => {
      this.isLoading = false;

      console.log('Verifying code:', code);
      console.log('Email:', this.email);
      console.log('Verification type:', this.verificationType);

      // Route based on verification purpose
      if (this.verificationType === 'reset') {
        alert('Code verified! Please create a new password.');
        this.router.navigate(['/auth/create-password']);
      } else {
        alert('Email verified successfully!');
        this.router.navigate(['/auth/signin']);
      }
    }, 2000);
  }

  // Resend verification code to user's email
  onResendCode(): void {
    if (this.isLoading) {
      return;
    }

    // Clear all input fields
    this.verificationCode = ['', '', '', '', ''];
    this.digitInputs.forEach(input => {
      if (input.nativeElement) {
        input.nativeElement.value = '';
      }
    });

    // Return focus to first field
    const firstInput = this.digitInputs.first?.nativeElement;
    if (firstInput) {
      firstInput.focus();
    }

    // TODO: Replace with actual API call to resend code
    console.log('Resending verification code...');
    alert('Verification code sent!');
  }
}
