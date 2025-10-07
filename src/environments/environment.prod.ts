/**
 * Environment configuration for production
 * Contains API endpoints, feature flags, and other environment-specific settings
 */
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // Production API URL
  apiTimeout: 15000, // 15 seconds timeout for production
  logLevel: 'error', // Only log errors in production
  enableErrorLogging: true, // Enable frontend error logging
  version: '1.0.0'
};

