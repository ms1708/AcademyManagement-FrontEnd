import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignUpRequest, SignUpResponse } from '../models/signup.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(request: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.baseUrl}/Account/SignUp`, request);
  }
  verifyOtp(data: { userid: string; username: string; otptext: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/ConfirmRegistration`, data);
  }
  resendOtp(emailId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/ResendOTP?emailId=${emailId}`, null);
  }

  submitStudentDetails(step1Data: any, step2Data: any, step3Data: any): Observable<any> {
    const payload = {
      student: step1Data,
      studentAdditionalDetails: step2Data,
      studentNextOfKin: step3Data,
    };

    return this.http.post(`${this.baseUrl}/Student/CreateStudentDetails`, payload);
  }
}
