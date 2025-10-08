import { Component, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  @ViewChildren('digit1,digit2,digit3,digit4,digit5') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  verificationCode: string[] = ['', '', '', '', ''];
  isLoading = false;
  email: string | null = null;
  verificationType: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.verificationType = params['type'] || 'email'; // default to 'email' verification
    });

    // Focus on the first input when component loads
    setTimeout(() => {
      const firstInput = this.digitInputs?.first?.nativeElement;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      this.verificationCode[index] = '';
      return;
    }

    this.verificationCode[index] = value;

    // Auto-focus next input if current input has a value
    if (value && index < 4) {
      const nextInput = this.digitInputs.toArray()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace') {
      // If current input is empty, move to previous input
      if (!input.value && index > 0) {
        const prevInput = this.digitInputs.toArray()[index - 1]?.nativeElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    }
    
    // Handle arrow keys
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

    // Handle paste
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      this.handlePaste();
    }

    // Handle Enter key
    if (event.key === 'Enter' && this.isCodeComplete()) {
      this.onVerify();
    }
  }

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
        
        // Focus on the next empty input or the last one if all are filled
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

  isCodeComplete(): boolean {
    return this.verificationCode.every(digit => digit !== '');
  }

  onVerify(): void {
    if (!this.isCodeComplete() || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const code = this.verificationCode.join('');

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;

      // TODO: Replace with actual verification logic
      console.log('Verifying code:', code);
      console.log('Email:', this.email);
      console.log('Verification type:', this.verificationType);

      // Handle different verification types
      if (this.verificationType === 'reset') {
        // Password reset verification - redirect to create password page
        alert('Code verified! Please create a new password.');
        this.router.navigate(['/auth/create-password']);
      } else {
        // Email verification - redirect to signin
        alert('Email verified successfully!');
        this.router.navigate(['/auth/signin']);
      }
    }, 2000);
  }

  onResendCode(): void {
    if (this.isLoading) {
      return;
    }

    // Clear the current code
    this.verificationCode = ['', '', '', '', ''];
    this.digitInputs.forEach(input => {
      if (input.nativeElement) {
        input.nativeElement.value = '';
      }
    });

    // Focus first input
    const firstInput = this.digitInputs.first?.nativeElement;
    if (firstInput) {
      firstInput.focus();
    }

    // TODO: Replace with actual resend logic
    console.log('Resending verification code...');
    alert('Verification code sent!');
  }
}
