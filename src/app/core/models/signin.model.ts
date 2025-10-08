export interface SignInRequest {
  firstName?: string; // optional for sign-in if backend only needs email/password
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface SignInResponse {
  token: string; // JWT token
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
