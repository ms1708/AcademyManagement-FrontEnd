export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  token?: string; // if your API returns JWT after signup
  message?: string;
}
