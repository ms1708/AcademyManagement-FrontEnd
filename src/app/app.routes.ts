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
        path: 'email-verification',
        loadComponent: () => import('./features/auth/email-verification/email-verification.component').then(m => m.EmailVerificationComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'forgot-password-verify',
        loadComponent: () => import('./features/auth/forgot-password-verify/forgot-password-verify.component').then(m => m.ForgotPasswordVerifyComponent)
      },
      {
        path: 'create-password',
        loadComponent: () => import('./features/auth/create-password/create-password.component').then(m => m.CreatePasswordComponent)
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

  // Student Portal (Builder.io version)
  {
    path: 'student-portal',
    loadComponent: () => import('./features/student-portal/student-portal/student-portal.component').then(m => m.StudentPortalComponent)
  },

  // Legacy routes - redirect to student portal
  {
    path: 'dashboard',
    redirectTo: '/student-portal',
    pathMatch: 'full'
  },
  {
    path: 'student-portal/dashboard',
    redirectTo: '/student-portal',
    pathMatch: 'full'
  },
  {
    path: 'student-portal/course-application',
    redirectTo: '/student-portal',
    pathMatch: 'full'
  },
  {
    path: 'student-portal/my-enrollment',
    redirectTo: '/student-portal',
    pathMatch: 'full'
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/auth/signin'
  }
];
