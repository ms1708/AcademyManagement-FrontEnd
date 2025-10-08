import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ForgotPasswordVerifyComponent } from './forgot-password-verify.component';

describe('ForgotPasswordVerifyComponent', () => {
  let component: ForgotPasswordVerifyComponent;
  let fixture: ComponentFixture<ForgotPasswordVerifyComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerifyComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordVerifyComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty verification code', () => {
    expect(component.verificationCode).toEqual(['', '', '', '', '']);
    expect(component.isLoading).toBeFalse();
  });

  it('should check if code is complete', () => {
    // Empty code
    expect(component.isCodeComplete()).toBeFalse();

    // Partial code
    component.verificationCode = ['1', '2', '3', '', ''];
    expect(component.isCodeComplete()).toBeFalse();

    // Complete code
    component.verificationCode = ['1', '2', '3', '4', '5'];
    expect(component.isCodeComplete()).toBeTrue();
  });

  it('should handle digit input correctly', () => {
    const mockEvent = {
      target: { value: '5' }
    } as any;

    component.onDigitInput(mockEvent, 0);
    expect(component.verificationCode[0]).toBe('5');
  });

  it('should reject non-numeric input', () => {
    const mockEvent = {
      target: { value: 'a' }
    } as any;

    component.onDigitInput(mockEvent, 0);
    expect(component.verificationCode[0]).toBe('');
    expect(mockEvent.target.value).toBe('');
  });

  it('should handle resend code', () => {
    // Set some values first
    component.verificationCode = ['1', '2', '3', '4', '5'];
    
    spyOn(window, 'alert');
    component.onResendCode();

    expect(component.verificationCode).toEqual(['', '', '', '', '']);
    expect(window.alert).toHaveBeenCalledWith('Verification code sent!');
  });

  it('should handle verify when code is complete', () => {
    component.verificationCode = ['1', '2', '3', '4', '5'];
    spyOn(window, 'alert');

    component.onVerify();
    expect(component.isLoading).toBeTrue();
  });

  it('should not verify when code is incomplete', () => {
    component.verificationCode = ['1', '2', '', '', ''];
    const initialLoading = component.isLoading;

    component.onVerify();
    expect(component.isLoading).toBe(initialLoading);
  });
});
