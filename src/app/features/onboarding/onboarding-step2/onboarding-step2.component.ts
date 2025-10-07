import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Onboarding Step 2 Component - Additional Learner Details
 * Part of a 3-step onboarding process
 * Matches the design and styling of authentication pages
 */
@Component({
  selector: 'app-onboarding-step2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './onboarding-step2.component.html',
  styleUrls: ['./onboarding-step2.component.scss']
})
export class OnboardingStep2Component {
  additionalDetailsForm: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  constructor() {
    this.additionalDetailsForm = this.fb.group({
      homeLanguage: ['', [Validators.required]],
      citizenship: ['', [Validators.required]],
      homeAddress: ['11 Biccard Street', [Validators.required]],
      addressLine2: [''],
      postalAddressLine1: [''],
      postalAddressLine2: ['11 Biccard Street'],
      city: ['Johannesburg', [Validators.required]],
      provinceState: ['', [Validators.required]],
      municipality: ['Jozi']
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.additionalDetailsForm.valid) {
      this.isLoading = true;
      const formData = this.additionalDetailsForm.value;

      // Mock submission - in real app, save data and navigate to next step
      setTimeout(() => {
        this.isLoading = false;
        this.errorLoggingService.logError('info', `Onboarding step 2 completed for user`);
        
        // Navigate to next step (step 3)
        this.router.navigate(['/onboarding/step3']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Handles back navigation to step 1
   */
  onBack(): void {
    this.router.navigate(['/onboarding/step1']);
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.additionalDetailsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
  getFieldError(fieldName: string): string {
    const field = this.additionalDetailsForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  /**
   * Checks if form is valid
   * @returns True if form is valid
   */
  isFormValid(): boolean {
    return this.additionalDetailsForm.valid;
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.additionalDetailsForm.controls).forEach(key => {
      const control = this.additionalDetailsForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Gets the current step number
   * @returns Current step number
   */
  getCurrentStep(): number {
    return 2;
  }

  /**
   * Gets the total number of steps
   * @returns Total number of steps
   */
  getTotalSteps(): number {
    return 3;
  }

  /**
   * Gets the progress percentage
   * @returns Progress percentage
   */
  getProgressPercentage(): number {
    return Math.round((this.getCurrentStep() / this.getTotalSteps()) * 100);
  }
}

