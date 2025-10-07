/**
 * User model representing user data from .NET Core backend
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

/**
 * User authentication request model
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  [key: string]: unknown;
}

/**
 * User authentication response model
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * User registration request model
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  [key: string]: unknown;
}

/**
 * User profile update request model
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}
