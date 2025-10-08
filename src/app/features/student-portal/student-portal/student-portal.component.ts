import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformation, AdditionalInformation, EducationalBackground, WorkBackground, ProgrammeDetails, ViewType } from '../../../core/models/user-info.model';

/**
 * Student Portal Component
 * Main dashboard for students to manage applications, view enrollment, and access services
 * Includes multi-step course application form with auto-save functionality
 */
@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-portal.component.html',
  styleUrl: './student-portal.component.scss'
})
export class StudentPortalComponent implements OnInit {
  private router = inject(Router);

  currentView: ViewType = 'dashboard';
  currentStep: number = 3; // Start at step 3 for programme details

  // Mock user data - will be replaced with actual API data
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

  // Optional student information
  additionalInfo: AdditionalInformation = {
    middleName: '',
    maritalStatus: '',
    homeTelephone: ''
  };

  // Educational history tracking
  educationalBackground: EducationalBackground = {
    lastSchoolAttended: '',
    highestGrade: '',
    dateGradeObtained: '',
    highestQualification: '',
    qualificationName: '',
    yearObtained: '',
    institutionAttended: ''
  };

  // Employment and socio-economic information
  workBackground: WorkBackground = {
    socioEconomicStatus: ''
  };

  // Course selection and learning resources
  programmeDetails: ProgrammeDetails = {
    courseName: '',
    hasComputer: false,
    hasInternet: false,
    hasLibrary: false
  };

  // Dashboard data
  dashboardStats = [
    {
      title: 'Profile',
      value: '85%',
      description: 'Complete'
    },
    {
      title: 'Applications',
      value: '3',
      description: 'Submitted'
    },
    {
      title: 'Enrolled',
      value: '1',
      description: 'Course'
    },
    {
      title: 'Progress',
      value: '65%',
      description: 'Average'
    }
  ];

  applicationStatuses = [
    {
      courseName: 'ISO 9000 Internal Auditing Training',
      status: 'Approved'
    },
    {
      courseName: 'ISO 9000 Development And Implementation',
      status: 'Pending'
    },
    {
      courseName: 'ISO 50001 Internal Auditing Training',
      status: 'Under Review'
    }
  ];

  enrolledCourses = [
    {
      title: 'ISO 9000 Internal Auditing Training Course',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/professional-setting-featuring-trainer-presenting-group-attentive-students-classroom-training-materials-whiteboard-background@2x.png',
      nextDeadline: 'Next deadline: 2024-02-15'
    },
    {
      title: 'Status',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/group-students-actively-participating-classroom-discussion-teacher-guiding-them@2x.png',
      nextDeadline: 'Active'
    }
  ];

  ngOnInit(): void {
    this.loadUserInformation();
    this.loadDraft();
  }

  // Load user profile data
  private loadUserInformation(): void {
    // TODO: Replace with actual API call to fetch user data
    console.log('Loading user information...');
  }

  // Handle sidebar navigation
  navigateToView(view: ViewType): void {
    this.currentView = view;
    
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

  // Progress to next step in application
  nextStep(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }

    this.saveDraft();

    if (this.currentStep < 4) {
      this.currentStep++;
      console.log(`Moving to Step ${this.currentStep}`);
    } else {
      console.log('Application completed!');
      alert('Application completed successfully!');
      // TODO: Submit application to backend
    }
  }

  // Go back to previous step
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      console.log(`Moving to Step ${this.currentStep}`);
    }
  }

  // Validate form based on which step user is on
  isFormValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.additionalInfo.maritalStatus;
      case 2:
        // All educational and work fields required
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
        // Course name and at least one learning resource required
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

  // Save application progress to local storage
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

    localStorage.setItem('courseApplicationDraft', JSON.stringify(draftData));
    console.log('Draft saved:', draftData);
  }

  // Restore saved application data
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

  // Trigger auto-save when form data changes
  onFormChange(): void {
    this.saveDraft();
  }
}
