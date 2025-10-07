# Academy Management System - Complete Project Structure
## Based on Business Requirements Document (BRD)

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
src/app/
├── core/                           # Core functionality
│   ├── services/                   # Business logic services
│   ├── guards/                     # Route protection
│   ├── interceptors/               # HTTP interceptors
│   ├── models/                     # Data models & interfaces
│   └── constants/                  # Application constants
├── shared/                         # Reusable components
│   ├── components/                 # UI components
│   ├── directives/                 # Custom directives
│   ├── pipes/                      # Custom pipes
│   ├── models/                     # Shared data models
│   └── utils/                      # Utility functions
├── features/                       # Feature modules
│   ├── auth/                       # Authentication
│   ├── profile/                    # User profile management
│   ├── application/                # Course applications
│   ├── enrollment/                 # Course enrollment
│   ├── dashboard/                  # Role-based dashboards
│   ├── admin/                      # Administrative functions
│   └── student/                    # Student-specific features
└── assets/                         # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 🎯 **COMPONENT STRUCTURE BY ROLE**

### **1. AUTHENTICATION MODULE** (`features/auth/`)

#### **Components:**
- `login/login.component` - User login form
- `register/register.component` - User registration form
- `email-confirmation/email-confirmation.component` - Email verification
- `password-reset/password-reset.component` - Password reset
- `password-confirmation/password-confirmation.component` - Password creation after email confirmation

#### **Services:**
- `auth.service` - Authentication logic
- `email-verification.service` - Email confirmation handling
- `password-reset.service` - Password reset functionality

#### **Models:**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  studentNumber?: string;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

---

### **2. PROFILE MODULE** (`features/profile/`)

#### **Components:**
- `profile-view/profile-view.component` - View profile information
- `profile-edit/profile-edit.component` - Edit profile form
- `document-upload/document-upload.component` - Upload ID/passport & proof of residence
- `profile-completion/profile-completion.component` - Profile completion status

#### **Services:**
- `profile.service` - Profile CRUD operations
- `document-upload.service` - File upload handling
- `profile-validation.service` - Profile validation logic

#### **Models:**
```typescript
interface UserProfile {
  id: string;
  userId: string;
  title: Title;
  fullName: string;
  preferredName?: string;
  studentNumber: string;
  nationality: string;
  dateOfBirth: Date;
  gender: Gender;
  email: string;
  primaryPhone: string;
  alternatePhone?: string;
  residentialAddress: Address;
  postalAddress: Address;
  idDocument?: DocumentUpload;
  proofOfResidence?: DocumentUpload;
  isComplete: boolean;
}

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface DocumentUpload {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedAt: Date;
}
```

---

### **3. APPLICATION MODULE** (`features/application/`)

#### **Components:**
- `application-form/application-form.component` - Multi-step application form
- `application-history/application-history.component` - View application status
- `application-review/application-review.component` - Review before submission
- `step-personal-info/step-personal-info.component` - Step 1: Personal Information
- `step-contact-details/step-contact-details.component` - Step 2: Contact Details
- `step-education/step-education.component` - Step 3: Education Background
- `step-course-selection/step-course-selection.component` - Step 4: Course Selection
- `step-documents/step-documents.component` - Step 5: Document Uploads
- `application-status/application-status.component` - Application status display

#### **Services:**
- `application.service` - Application CRUD operations
- `application-validation.service` - Form validation
- `course-selection.service` - Course selection logic
- `application-status.service` - Status tracking

#### **Models:**
```typescript
interface CourseApplication {
  id: string;
  userId: string;
  studentNumber: string;
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Step 1: Personal Information
  personalInfo: PersonalInformation;
  
  // Step 2: Contact Details
  contactDetails: ContactDetails;
  
  // Step 3: Education Background
  educationBackground: EducationBackground;
  
  // Step 4: Course Selection
  courseSelection: CourseSelection;
  
  // Step 5: Documents
  documents: ApplicationDocuments;
}

interface PersonalInformation {
  firstName: string;
  middleName?: string;
  surname: string;
  dateOfBirth: Date;
  idPassportNumber: string;
  gender: Gender;
  nationality: string;
  maritalStatus: MaritalStatus;
}

interface ContactDetails {
  email: string;
  mobileNumber: string;
  homeTelephone?: string;
  residentialAddress: Address;
  postalAddress: Address;
  province: string;
}

interface EducationBackground {
  highestQualification: string;
  yearCompleted: number;
  institutionName: string;
}

interface CourseSelection {
  courseId: string;
  courseName: string;
  intakePeriod: string;
}

interface ApplicationDocuments {
  idCopy?: DocumentUpload;
  certificates?: DocumentUpload[];
}

enum ApplicationStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
```

---

### **4. ENROLLMENT MODULE** (`features/enrollment/`)

#### **Components:**
- `enrollment-form/enrollment-form.component` - Multi-step enrollment form
- `enrollment-status/enrollment-status.component` - Enrollment status display
- `onboarding/onboarding.component` - 3-step onboarding process
- `step-learner-details/step-learner-details.component` - Step 1: Learner Details
- `step-additional-details/step-additional-details.component` - Step 2: Additional Details
- `step-next-of-kin/step-next-of-kin.component` - Step 3: Next of Kin
- `payment-details/payment-details.component` - Payment information
- `enrollment-confirmation/enrollment-confirmation.component` - Final confirmation

#### **Services:**
- `enrollment.service` - Enrollment operations
- `onboarding.service` - Onboarding process
- `payment.service` - Payment processing
- `lms-integration.service` - LMS account creation

#### **Models:**
```typescript
interface Enrollment {
  id: string;
  userId: string;
  applicationId: string;
  studentNumber: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  
  // Onboarding Data
  learnerDetails: LearnerDetails;
  additionalDetails: AdditionalDetails;
  nextOfKin: NextOfKinDetails;
  
  // Payment Information
  paymentDetails: PaymentDetails;
  
  // Documents
  enrollmentDocuments: EnrollmentDocuments;
  
  // LMS Integration
  lmsCredentials?: LMSCredentials;
}

interface LearnerDetails {
  title: Title;
  nationality: string;
  idNumber?: string;
  dateOfBirth: Date;
  gender: Gender;
  disability?: string;
  specialNeeds?: string;
  contactNumbers: ContactNumbers;
}

interface AdditionalDetails {
  homeLanguage: string;
  citizenship: string;
  homeAddress: Address;
  postalAddress: Address;
  city: string;
  province: string;
  municipality: string;
}

interface NextOfKinDetails {
  title: Title;
  fullName: string;
  surname: string;
  relationship: string;
  contactNumber: string;
  email: string;
  residentialAddress: Address;
}

interface PaymentDetails {
  sourceOfFunding: FundingSource;
  sponsorDetails?: SponsorDetails;
  paymentMethod?: PaymentMethod;
}

interface EnrollmentDocuments {
  certifiedId: DocumentUpload;
  certificates: DocumentUpload[];
  cv?: DocumentUpload;
  proofOfPayment?: DocumentUpload;
}

enum EnrollmentStatus {
  PENDING = 'pending',
  ENROLLED = 'enrolled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

---

### **5. ADMIN MODULE** (`features/admin/`)

#### **Components:**
- `admin-dashboard/admin-dashboard.component` - Admin overview
- `application-management/application-management.component` - Manage applications
- `enrollment-management/enrollment-management.component` - Manage enrollments
- `user-management/user-management.component` - User administration
- `course-management/course-management.component` - Course CRUD
- `course-offerings/course-offerings.component` - Course instances
- `access-control/access-control.component` - Role & permission management
- `reports/reports.component` - Reporting dashboard
- `application-approval/application-approval.component` - Approve/reject applications
- `manual-application/manual-application.component` - Create applications manually

#### **Services:**
- `admin.service` - Admin operations
- `application-management.service` - Application approval/rejection
- `course-management.service` - Course CRUD operations
- `user-management.service` - User administration
- `reporting.service` - Report generation
- `role-management.service` - Role & permission management

#### **Models:**
```typescript
interface Course {
  id: string;
  name: string;
  description: string;
  accreditation: string;
  accreditor: string;
  saqaId: string;
  level: number;
  credits: number;
  isActive: boolean;
  code: string;
  category: string;
  status: CourseStatus;
  deliveryMode: DeliveryMode;
  duration: number;
  startDate: Date;
  endDate: Date;
  venue: string;
  resourceLink: string;
  complianceInfo: string;
  pricing: CoursePricing;
  refundPolicy: string;
  evidencePackPath: string;
}

interface CourseOffering {
  id: string;
  courseId: string;
  code: string;
  academicYear: string;
  term: string;
  intake: string;
  titleOverride?: string;
  notes?: string;
  leadFacilitator: string;
  coFacilitator?: string;
  admissionsOfficer: string;
  deliveryMode: DeliveryMode;
  schedule: Schedule;
  startDate: Date;
  endDate: Date;
  venue: string;
  status: OfferingStatus;
  enrollmentCapacity: number;
  waitlistCapacity: number;
  selfEnrollEnabled: boolean;
  isVisible: boolean;
  reportingEnabled: boolean;
  documents: DocumentUpload[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  level: number;
  hierarchy: string;
  reporting: string;
  status: RoleStatus;
  modules: Module[];
  permissions: Permission[];
  responsibilities: string[];
}

interface Permission {
  id: string;
  name: string;
  module: string;
  action: PermissionAction;
  description: string;
}
```

---

### **6. STUDENT MODULE** (`features/student/`)

#### **Components:**
- `student-dashboard/student-dashboard.component` - Student overview
- `application-status/application-status.component` - Application tracking
- `enrollment-status/enrollment-status.component` - Enrollment tracking
- `lms-access/lms-access.component` - LMS login link
- `course-materials/course-materials.component` - Course resources

#### **Services:**
- `student.service` - Student-specific operations
- `application-tracking.service` - Track application progress
- `enrollment-tracking.service` - Track enrollment status

---

### **7. SHARED COMPONENTS** (`shared/components/`)

#### **UI Components:**
- `multi-step-form/multi-step-form.component` - Reusable multi-step form wrapper
- `form-step/form-step.component` - Individual form step component
- `file-upload/file-upload.component` - File upload component
- `address-form/address-form.component` - Address input form
- `contact-form/contact-form.component` - Contact information form
- `document-viewer/document-viewer.component` - View uploaded documents
- `status-badge/status-badge.component` - Status display component
- `loading-spinner/loading-spinner.component` - Loading indicator
- `confirmation-dialog/confirmation-dialog.component` - Confirmation modal
- `profile-avatar/profile-avatar.component` - User avatar with menu

#### **Layout Components:**
- `main-layout/main-layout.component` - Main application layout
- `sidebar/sidebar.component` - Navigation sidebar
- `header/header.component` - Application header
- `footer/footer.component` - Application footer
- `breadcrumb/breadcrumb.component` - Navigation breadcrumbs

#### **Data Components:**
- `data-table/data-table.component` - Reusable data table
- `pagination/pagination.component` - Table pagination
- `search-filter/search-filter.component` - Search and filter
- `export-button/export-button.component` - Data export functionality

---

### **8. CORE SERVICES** (`core/services/`)

#### **Business Services:**
- `api.service` - HTTP API communication
- `auth.service` - Authentication & authorization
- `error-logging.service` - Error tracking & logging
- `notification.service` - User notifications
- `file-upload.service` - File handling
- `email.service` - Email operations
- `validation.service` - Form validation
- `permission.service` - Permission checking

#### **Integration Services:**
- `lms-integration.service` - LMS system integration
- `payment-integration.service` - Payment gateway integration
- `email-integration.service` - Email service integration

---

### **9. CORE MODELS** (`core/models/`)

#### **Base Models:**
```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

#### **Enums:**
```typescript
enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  FACILITATOR = 'facilitator'
}

enum Title {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  DR = 'Dr',
  PROF = 'Prof'
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

enum FundingSource {
  SPONSORED = 'sponsored',
  SELF_FUNDED = 'self_funded',
  BOTH = 'both'
}

enum DeliveryMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

enum CourseStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

enum OfferingStatus {
  SCHEDULED = 'scheduled',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}
```

---

## 🎨 **UI/UX DESIGN SYSTEM**

### **Color Palette:**
- Primary: #1976d2 (Blue)
- Secondary: #424242 (Dark Gray)
- Accent: #ff4081 (Pink)
- Success: #4caf50 (Green)
- Warning: #ff9800 (Orange)
- Error: #f44336 (Red)
- Info: #2196f3 (Light Blue)

### **Typography:**
- Primary Font: Roboto
- Headings: Roboto (Medium, SemiBold, Bold)
- Body Text: Roboto (Regular, Medium)
- Code: 'Courier New', monospace

### **Spacing System:**
- Base Unit: 8px
- Scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### **Component Themes:**
- Cards: Material Design elevation
- Forms: Consistent input styling
- Buttons: Primary, secondary, accent variants
- Tables: Sortable, filterable, paginated
- Modals: Centered, responsive overlays

---

## 🔄 **WORKFLOW INTEGRATION**

### **Student Journey:**
1. **Registration** → Email Confirmation → Password Creation
2. **Profile Completion** → Document Uploads
3. **Course Application** → Multi-step Form → Submission
4. **Application Review** → Admin Approval/Rejection
5. **Enrollment** → Onboarding → Payment → LMS Access

### **Admin Workflow:**
1. **Application Management** → Review → Approve/Reject
2. **Enrollment Processing** → Manual Applications → LMS Integration
3. **Course Management** → Offerings → Capacity Management
4. **User Management** → Role Assignment → Permission Control
5. **Reporting** → Analytics → Export Functions

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 1440px
- Large Desktop: 1440px+

### **Mobile-First Approach:**
- Collapsible sidebar navigation
- Touch-friendly interface elements
- Optimized form layouts
- Swipe gestures for mobile interactions

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **Phase 1: Foundation**
1. Authentication system
2. User profile management
3. Basic navigation and layout
4. Core services and models

### **Phase 2: Student Features**
1. Course application process
2. Multi-step forms
3. Document upload functionality
4. Application status tracking

### **Phase 3: Admin Features**
1. Application management
2. User administration
3. Course management
4. Reporting dashboard

### **Phase 4: Advanced Features**
1. Enrollment process
2. LMS integration
3. Payment processing
4. Advanced reporting

### **Phase 5: Polish & Optimization**
1. UI/UX refinements
2. Performance optimization
3. Accessibility improvements
4. Testing and bug fixes

---

This structure provides a comprehensive foundation for implementing the Student Portal UI based on the BRD requirements. Each component is designed to handle specific functionality while maintaining consistency and reusability across the application.

