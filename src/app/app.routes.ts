import { Routes } from '@angular/router';

/**
 * Application routes configuration
 * Basic Angular setup with core infrastructure only
 */
export const routes: Routes = [
  // Default route - redirect to signin
  {
    path: '',
    redirectTo: '/auth/signin',
    pathMatch: 'full'
  },
  
  // Authentication routes
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./features/auth/signin/signin.component').then(m => m.SigninComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/signin/signin.component').then(m => m.SigninComponent) // Placeholder
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/email-verification/email-verification.component').then(m => m.EmailVerificationComponent)
      }
    ]
  },

  // Onboarding routes
  {
    path: 'onboarding',
    children: [
      {
        path: 'step1',
        loadComponent: () => import('./features/onboarding/onboarding-step1/onboarding-step1.component').then(m => m.OnboardingStep1Component)
      },
      {
        path: 'step2',
        loadComponent: () => import('./features/onboarding/onboarding-step2/onboarding-step2.component').then(m => m.OnboardingStep2Component)
      },
      {
        path: 'step3',
        loadComponent: () => import('./features/onboarding/onboarding-step3/onboarding-step3.component').then(m => m.OnboardingStep3Component)
      }
    ]
  },

  // Student Portal routes
  {
    path: 'student-portal',
    loadComponent: () => import('./features/student-portal/student-portal/student-portal.component').then(m => m.StudentPortalComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student-portal/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'course-application',
        loadComponent: () => import('./features/student-portal/course-application/course-application.component').then(m => m.CourseApplicationComponent)
      },
      {
        path: 'my-enrollment',
        loadComponent: () => import('./features/student-portal/my-enrollment/my-enrollment.component').then(m => m.MyEnrollmentComponent)
      }
    ]
  },

  // Dashboard route (legacy - redirect to student portal)
  {
    path: 'dashboard',
    redirectTo: '/student-portal/dashboard',
    pathMatch: 'full'
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/auth/signin'
  }
];
