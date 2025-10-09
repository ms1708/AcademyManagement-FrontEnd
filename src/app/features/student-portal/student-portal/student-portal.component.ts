import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformation, AdditionalInformation, EducationalBackground, WorkBackground, ProgrammeDetails, ViewType } from '../../../core/models/user-info.model';

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
  currentStep: number = 3; // Start at step 3 for programme details

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

  educationalBackground: EducationalBackground = {
    lastSchoolAttended: '',
    highestGrade: '',
    dateGradeObtained: '',
    highestQualification: '',
    qualificationName: '',
    yearObtained: '',
    institutionAttended: ''
  };

  workBackground: WorkBackground = {
    socioEconomicStatus: ''
  };

  programmeDetails: ProgrammeDetails = {
    courseName: '',
    hasComputer: false,
    hasInternet: false,
    hasLibrary: false
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
    // Validate required fields based on current step
    if (!this.isFormValid()) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }

    // Save current step data
    this.saveDraft();

    // Move to next step
    if (this.currentStep < 4) {
      this.currentStep++;
      console.log(`Moving to Step ${this.currentStep}`);
    } else {
      console.log('Application completed!');
      alert('Application completed successfully!');
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      console.log(`Moving to Step ${this.currentStep}`);
    }
  }

  // Method to handle form validation based on current step
         isFormValid(): boolean {
           switch (this.currentStep) {
             case 1:
               return !!this.additionalInfo.maritalStatus;
             case 2:
               return !!(
                 this.educationalBackground.lastSchoolAttended &&
                 this.educationalBackground.highestGrade &&
                 this.educationalBackground.dateGradeObtained &&
                 this.educationalBackground.highestQualification &&
                 this.educationalBackground.qualificationName &&
                 this.educationalBackground.yearObtained &&
                 this.educationalBackground.institutionAttended &&
                 this.workBackground.socioEconomicStatus
               );
             case 3:
               return !!(
                 this.programmeDetails.courseName &&
                 (this.programmeDetails.hasComputer || 
                  this.programmeDetails.hasInternet || 
                  this.programmeDetails.hasLibrary)
               );
             default:
               return true;
           }
         }

  // Method to handle saving draft
  saveDraft(): void {
    const draftData = {
      userInfo: this.userInfo,
      additionalInfo: this.additionalInfo,
      educationalBackground: this.educationalBackground,
      workBackground: this.workBackground,
      programmeDetails: this.programmeDetails,
      currentStep: this.currentStep,
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
        this.educationalBackground = parsed.educationalBackground || this.educationalBackground;
        this.workBackground = parsed.workBackground || this.workBackground;
        this.programmeDetails = parsed.programmeDetails || this.programmeDetails;
        this.currentStep = parsed.currentStep || this.currentStep;
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
