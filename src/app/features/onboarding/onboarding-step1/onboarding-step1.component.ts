import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorLoggingService } from '../../../core/services/error-logging.service';
import { OnboardingDataService } from '../OnboardingDataService';

/**
 * Onboarding Step 1 Component - Learner Details
 * Part of a 3-step onboarding process
 * Matches the design and styling of authentication pages
 */
@Component({
  selector: 'app-onboarding-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './onboarding-step1.component.html',
  styleUrls: ['./onboarding-step1.component.scss'],
})
export class OnboardingStep1Component {
  learnerDetailsForm: FormGroup;
  isLoading = false;

  // Mock data for dropdowns
  titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  nationalities = [
    'South African',
    'American',
    'British',
    'Canadian',
    'Australian',
    'German',
    'French',
    'Other',
  ];
  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  disabilities = ['None', 'Visual', 'Hearing', 'Motor', 'Cognitive', 'Other'];

  private fb = inject(FormBuilder);
  private errorLoggingService = inject(ErrorLoggingService);
  private router = inject(Router);
  private onboardingService = inject(OnboardingDataService);

  constructor() {
    this.learnerDetailsForm = this.fb.group({
      title: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      disability: ['', [Validators.required]],
      specialNeedsRequirements: [''],
      contactNo: ['', [Validators.required]],
      alternateContactNo: [''],
      userId: '',
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.learnerDetailsForm.valid) {
      this.isLoading = true;
      const formData = this.learnerDetailsForm.value;
      const getuserLogindetails = this.onboardingService.getuserLogindetails();
      //formData.studentName = getuserLogindetails.firstName + ' ' + getuserLogindetails.lastName;
      formData.studentName =
        `${getuserLogindetails?.firstName ?? ''} ${getuserLogindetails?.lastName ?? ''}`.trim() ||
        'Udit';

      formData.userId = this.onboardingService.getUserId();
      // formData.email = getuserLogindetails.email ?? 'udit@gmail.com';
      formData.email = getuserLogindetails?.email ?? 'default@example.com';

      // Mock submission - in real app, save data and navigate to next step
      setTimeout(() => {
        this.isLoading = false;
        this.errorLoggingService.logError('info', `Onboarding step 1 completed for user`);
        this.onboardingService.setStep1Data(formData);
        // Navigate to next step (step 2)
        this.router.navigate(['/onboarding/step2']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Handles back navigation
   */
  onBack(): void {
    // Navigate back to previous page or dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Checks if a form field is invalid and touched
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.learnerDetailsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Gets the error message for a form field
   * @param fieldName - Name of the form field
   * @returns Error message string
   */
  getFieldError(fieldName: string): string {
    const field = this.learnerDetailsForm.get(fieldName);
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
    return this.learnerDetailsForm.valid;
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.learnerDetailsForm.controls).forEach(key => {
      const control = this.learnerDetailsForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Gets the current step number
   * @returns Current step number
   */
  getCurrentStep(): number {
    return 1;
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
