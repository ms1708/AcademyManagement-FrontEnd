import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { ErrorLoggingService } from './core/services/error-logging.service';
import { authInterceptor } from './core/interceptors/AuthInterceptor.interceptor';

/**
 * Application configuration
 * Core setup with HTTP interceptors and basic providers
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        errorInterceptor, // your existing error interceptor
        authInterceptor, // ✅ add JWT auth interceptor here
      ])
    ),
    provideAnimationsAsync(),
    ErrorLoggingService,
  ],
};
