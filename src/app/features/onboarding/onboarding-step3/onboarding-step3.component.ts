import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';

/**
 * Onboarding Step 3 Component - Next of Kin Particulars
 * Final step of a 3-step onboarding process
 * Matches the design and styling of authentication pages
 */
@Component({
  selector: 'app-onboarding-step3',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './onboarding-step3.component.html',
  styleUrls: ['./onboarding-step3.component.scss']
})
export class OnboardingStep3Component {
  nextOfKinForm: FormGroup;
  isLoading = false;

  // Mock data for dropdowns
  titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  relationships = ['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Friend', 'Other'];

  private fb = inject(FormBuilder);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);

  constructor() {
    this.nextOfKinForm = this.fb.group({
      title: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      residentialAddress: ['', [Validators.required]]
    });
  }

  /**
   * Handles form submission - completes onboarding
   */
  onSubmit(): void {
    if (this.nextOfKinForm.valid) {
      this.isLoading = true;
      const formData = this.nextOfKinForm.value;

      // Mock submission - in real app, complete onboarding and redirect to dashboard
      setTimeout(() => {
        this.isLoading = false;
        this.errorLoggingService.logError('info', `Onboarding completed successfully for user`);
        
        // Navigate to student portal after onboarding completion
        this.router.navigate(['/student-portal']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Handles back navigation to step 2
   */
  onBack(): void {
    this.router.navigate(['/onboarding/step2']);
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.nextOfKinForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
  getFieldError(fieldName: string): string {
    const field = this.nextOfKinForm.get(fieldName);
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
    return this.nextOfKinForm.valid;
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.nextOfKinForm.controls).forEach(key => {
      const control = this.nextOfKinForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Gets the current step number
   * @returns Current step number
   */
  getCurrentStep(): number {
    return 3;
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

