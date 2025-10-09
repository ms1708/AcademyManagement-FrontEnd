export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
    token?: string; // optional if your API returns a token
    message?: string;
  };
  isEmailDuplicate: boolean;
}
