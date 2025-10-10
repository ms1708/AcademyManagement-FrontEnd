import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformation, AdditionalInformation, EducationalBackground, WorkBackground, ProgrammeDetails, PaymentDetails, ViewType } from '../../../core/models/user-info.model';

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
  currentStep: number = 1; // Start at step 1 for additional information

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
    socioEconomicStatus: '',
    roleName: '',
    mainResponsibilities: '',
    employerDetails: {
      companyName: '',
      contactPerson: '',
      telephoneNumber: '',
      cellphoneNumber: '',
      emailAddress: '',
      physicalAddress: ''
    }
  };

  programmeDetails: ProgrammeDetails = {
    courseName: '',
    hasComputer: false,
    hasInternet: false,
    hasLibrary: false
  };

  paymentDetails: PaymentDetails = {
    sourceOfFunding: ''
  };

  termsAccepted: boolean = false;

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
      const errorMessage = this.currentStep === 5 
        ? 'Please accept the terms and conditions to submit your application.' 
        : 'Please fill in all required fields before proceeding.';
      alert(errorMessage);
      return;
    }

    // Save current step data
    this.saveDraft();

    // Move to next step or submit
    if (this.currentStep < 5) {
      this.currentStep++;
      console.log(`Moving to Step ${this.currentStep}`);
    } else {
      // Submit the application
      this.submitApplication();
    }
  }

  submitApplication(): void {
    console.log('Submitting application...');
    console.log('Application Data:', {
      userInfo: this.userInfo,
      additionalInfo: this.additionalInfo,
      educationalBackground: this.educationalBackground,
      workBackground: this.workBackground,
      programmeDetails: this.programmeDetails,
      paymentDetails: this.paymentDetails
    });
    
    alert('Application submitted successfully! You will receive a confirmation email shortly.');
    
    // In a real application, this would make an API call to submit the data
    // After successful submission, redirect to dashboard
    this.currentView = 'dashboard';
    this.router.navigate(['/student-portal/dashboard']);
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
        const educationValid = !!(
          this.educationalBackground.lastSchoolAttended &&
          this.educationalBackground.highestGrade &&
          this.educationalBackground.dateGradeObtained &&
          this.educationalBackground.highestQualification &&
          this.educationalBackground.qualificationName &&
          this.educationalBackground.yearObtained &&
          this.educationalBackground.institutionAttended &&
          this.workBackground.socioEconomicStatus
        );
        
        // Check employment fields if employed or self-employed
        if (this.workBackground.socioEconomicStatus === 'employed' || 
            this.workBackground.socioEconomicStatus === 'self-employed') {
          return educationValid && !!(
            this.workBackground.roleName &&
            this.workBackground.mainResponsibilities &&
            this.workBackground.employerDetails?.companyName &&
            this.workBackground.employerDetails?.contactPerson &&
            this.workBackground.employerDetails?.telephoneNumber &&
            this.workBackground.employerDetails?.cellphoneNumber &&
            this.workBackground.employerDetails?.emailAddress &&
            this.workBackground.employerDetails?.physicalAddress
          );
        }
        
        return educationValid;
      case 3:
        return !!(
          this.programmeDetails.courseName &&
          (this.programmeDetails.hasComputer || 
           this.programmeDetails.hasInternet || 
           this.programmeDetails.hasLibrary)
        );
      case 4:
        return !!this.paymentDetails.sourceOfFunding;
      case 5:
        return this.termsAccepted;
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

  // Check if employment fields should be displayed
  showEmploymentFields(): boolean {
    return this.workBackground.socioEconomicStatus === 'employed' || 
           this.workBackground.socioEconomicStatus === 'self-employed';
  }
}
