import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OnboardingDataService {
  private step1Data: any = null;
  private step2Data: any = null;
  private userId: string | null = null;
  private userloginDetaisl: any = null;

  setStep1Data(data: any) {
    this.step1Data = data;
  }
  setUserId(id: string) {
    this.userId = id;
  }
  getUserId() {
    return this.userId;
  }
  getStep1Data() {
    return this.step1Data;
  }

  setStep2Data(data: any) {
    this.step2Data = data;
  }
  setUserData(data: any) {
    this.userloginDetaisl = data;
  }
  getuserLogindetails() {
    return this.userloginDetaisl;
  }
  getStep2Data() {
    return this.step2Data;
  }

  // Combine all data for final submission
  getFinalData(step3Data: any) {
    return {
      student: this.step1Data,
      studentAdditionalDetails: this.step2Data,
      studentNextOfKin: step3Data,
    };
  }
}
