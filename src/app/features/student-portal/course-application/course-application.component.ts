import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserInfo {
  fullName: string;
  contactNumber: string;
  idNumber: string;
  nationality: string;
  homeAddress: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

interface ApplicationData {
  middleName: string;
  homeTelephone: string;
  maritalStatus: string;
  selectedCourse: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  fee: string;
  startDate: string;
}

interface Document {
  id: string;
  name: string;
  description: string;
  uploaded: boolean;
  file?: File;
}

@Component({
  selector: 'app-course-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-application.component.html',
  styleUrls: ['./course-application.component.scss']
})
export class CourseApplicationComponent implements OnInit {
  currentStep = 1;
  
  userInfo: UserInfo = {
    fullName: 'Thandi Dlovu',
    contactNumber: '+27 612345678',
    idNumber: '9812249086080',
    nationality: 'South Africa',
    homeAddress: '11 Biccard Street, Johannesburg, Gauteng',
    email: 'Thandi@Dlovu.com',
    dateOfBirth: '1998-12-24',
    gender: 'Female'
  };

  applicationData: ApplicationData = {
    middleName: '',
    homeTelephone: '',
    maritalStatus: '',
    selectedCourse: ''
  };

  availableCourses: Course[] = [
    {
      id: 'course-1',
      name: 'Business Management',
      description: 'Comprehensive business management course covering leadership, strategy, and operations.',
      duration: '12 months',
      fee: 'R25,000',
      startDate: '2024-02-01'
    },
    {
      id: 'course-2',
      name: 'Information Technology',
      description: 'Modern IT course covering programming, networking, and system administration.',
      duration: '18 months',
      fee: 'R35,000',
      startDate: '2024-03-01'
    },
    {
      id: 'course-3',
      name: 'Digital Marketing',
      description: 'Complete digital marketing course including SEO, social media, and analytics.',
      duration: '6 months',
      fee: 'R15,000',
      startDate: '2024-01-15'
    },
    {
      id: 'course-4',
      name: 'Healthcare Administration',
      description: 'Healthcare management course covering medical records, billing, and patient care.',
      duration: '10 months',
      fee: 'R20,000',
      startDate: '2024-02-15'
    }
  ];

  requiredDocuments: Document[] = [
    {
      id: 'doc-1',
      name: 'ID Document',
      description: 'Clear copy of your South African ID document',
      uploaded: false
    },
    {
      id: 'doc-2',
      name: 'Academic Transcripts',
      description: 'Official transcripts from your previous educational institution',
      uploaded: false
    },
    {
      id: 'doc-3',
      name: 'Proof of Address',
      description: 'Utility bill or bank statement not older than 3 months',
      uploaded: false
    },
    {
      id: 'doc-4',
      name: 'Passport Photo',
      description: 'Recent passport-sized photograph',
      uploaded: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  get selectedCourseDetails(): Course | undefined {
    return this.availableCourses.find(course => course.id === this.applicationData.selectedCourse);
  }

  nextStep(): void {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.applicationData.maritalStatus !== '';
      case 2:
        return this.applicationData.selectedCourse !== '';
      case 3:
        return this.requiredDocuments.every(doc => doc.uploaded);
      default:
        return true;
    }
  }

  canSubmit(): boolean {
    return this.currentStep === 4 && 
           this.applicationData.maritalStatus !== '' &&
           this.applicationData.selectedCourse !== '' &&
           this.requiredDocuments.every(doc => doc.uploaded);
  }

  selectCourse(courseId: string): void {
    this.applicationData.selectedCourse = courseId;
  }

  onFileSelected(event: any, docId: string): void {
    const file = event.target.files[0];
    if (file) {
      const document = this.requiredDocuments.find(doc => doc.id === docId);
      if (document) {
        document.file = file;
        document.uploaded = true;
      }
    }
  }

  submitApplication(): void {
    if (this.canSubmit()) {
      // Here you would typically send the application data to your backend
      console.log('Application submitted:', {
        userInfo: this.userInfo,
        applicationData: this.applicationData,
        documents: this.requiredDocuments
      });

      // Show success message and redirect
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      this.router.navigate(['/student-portal/dashboard']);
    }
  }
}