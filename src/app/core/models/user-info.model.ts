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

export interface EducationalBackground {
  lastSchoolAttended: string;
  highestGrade: string;
  dateGradeObtained: string;
  highestQualification: string;
  qualificationName: string;
  yearObtained: string;
  institutionAttended: string;
}

export interface WorkBackground {
  socioEconomicStatus: string;
}

export interface ProgrammeDetails {
  courseName: string;
  hasComputer: boolean;
  hasInternet: boolean;
  hasLibrary: boolean;
}

export interface CourseApplicationData {
  userInfo: UserInformation;
  additionalInfo: AdditionalInformation;
  educationalBackground?: EducationalBackground;
  workBackground?: WorkBackground;
  programmeDetails?: ProgrammeDetails;
  currentStep: number;
  selectedCourse?: string;
  uploadedDocuments?: string[];
}

export type ViewType = 'dashboard' | 'course-application' | 'my-enrollment';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
