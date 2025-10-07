export interface UserInformation {
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string;
  nationality: string;
  homeAddress: string;
}

export interface AdditionalInformation {
  middleName: string;
  maritalStatus: string;
  homeTelephone: string;
}

export interface CourseApplicationData {
  userInfo: UserInformation;
  additionalInfo: AdditionalInformation;
  currentStep: number;
  selectedCourse?: string;
  uploadedDocuments?: string[];
}

export type ViewType = 'dashboard' | 'course-application' | 'my-enrollment';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
