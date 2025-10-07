import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformation, AdditionalInformation, ViewType } from '../../../core/models/user-info.model';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-portal.component.html',
  styleUrl: './student-portal.component.scss'
})
export class StudentPortalComponent implements OnInit {
  private router = inject(Router);

  currentView: ViewType = 'course-application';

  userInfo: UserInformation = {
    fullName: 'Thandi Dlovu',
    email: 'Thandi@Dlovu.com',
    contactNumber: '+27 612345678',
    dateOfBirth: '1998-12-24',
    idNumber: '9812249086080',
    gender: 'Female',
    nationality: 'South Africa',
    homeAddress: '11 Biccard Street, Johannesburg, Gauteng'
  };

  additionalInfo: AdditionalInformation = {
    middleName: '',
    maritalStatus: '',
    homeTelephone: ''
  };

  ngOnInit(): void {
    // Load user information from service/API in real implementation
    this.loadUserInformation();
  }

  private loadUserInformation(): void {
    // In a real application, this would fetch from a service
    // For now, we're using mock data that matches the Figma design
    console.log('Loading user information...');
  }

  navigateToView(view: ViewType): void {
    this.currentView = view;
    
    // Navigate to the appropriate route
    switch (view) {
      case 'dashboard':
        this.router.navigate(['/student-portal/dashboard']);
        break;
      case 'course-application':
        this.router.navigate(['/student-portal/course-application']);
        break;
      case 'my-enrollment':
        this.router.navigate(['/student-portal/my-enrollment']);
        break;
    }
  }

  nextStep(): void {
    // Validate required fields
    if (!this.additionalInfo.maritalStatus) {
      alert('Please select your marital status before proceeding.');
      return;
    }

    // Navigate to next step of the application
    console.log('Proceeding to next step with data:', {
      userInfo: this.userInfo,
      additionalInfo: this.additionalInfo
    });

    // In a real implementation, this would:
    // 1. Save the current step data
    // 2. Navigate to the next step component
    // 3. Update the progress indicator
    
    // For now, we'll just log the action
    alert('Moving to Step 2: Course Selection');
  }

  // Method to handle form validation
  isFormValid(): boolean {
    return !!this.additionalInfo.maritalStatus;
  }

  // Method to handle saving draft
  saveDraft(): void {
    const draftData = {
      userInfo: this.userInfo,
      additionalInfo: this.additionalInfo,
      timestamp: new Date().toISOString()
    };

    // Save to local storage or service
    localStorage.setItem('courseApplicationDraft', JSON.stringify(draftData));
    console.log('Draft saved:', draftData);
  }

  // Method to load draft data
  loadDraft(): void {
    const draftData = localStorage.getItem('courseApplicationDraft');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        this.additionalInfo = parsed.additionalInfo || this.additionalInfo;
        console.log('Draft loaded:', parsed);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }

  // Auto-save functionality
  onFormChange(): void {
    // Debounced auto-save could be implemented here
    this.saveDraft();
  }
}
