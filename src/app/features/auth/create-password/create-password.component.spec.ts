import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePasswordComponent } from './create-password.component';

describe('CreatePasswordComponent', () => {
  let component: CreatePasswordComponent;
  let fixture: ComponentFixture<CreatePasswordComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreatePasswordComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePasswordComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.createPasswordForm.get('password')?.value).toBe('');
    expect(component.createPasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate password requirements', () => {
    const passwordControl = component.createPasswordForm.get('password');
    
    // Test required validation
    expect(passwordControl?.hasError('required')).toBeTruthy();
    
    // Test minimum length validation
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    // Test valid password
    passwordControl?.setValue('validpassword123');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate password confirmation', () => {
    const passwordControl = component.createPasswordForm.get('password');
    const confirmPasswordControl = component.createPasswordForm.get('confirmPassword');
    
    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('differentpassword');
    
    component.createPasswordForm.updateValueAndValidity();
    
    expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeTruthy();
    expect(component.createPasswordForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should be valid when passwords match and meet requirements', () => {
    const passwordControl = component.createPasswordForm.get('password');
    const confirmPasswordControl = component.createPasswordForm.get('confirmPassword');
    
    passwordControl?.setValue('validpassword123');
    confirmPasswordControl?.setValue('validpassword123');
    
    component.createPasswordForm.updateValueAndValidity();
    
    expect(component.createPasswordForm.valid).toBeTruthy();
  });

  it('should navigate to sign in on skip', () => {
    component.onSkip();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/signin']);
  });

  it('should handle form submission', () => {
    const passwordControl = component.createPasswordForm.get('password');
    const confirmPasswordControl = component.createPasswordForm.get('confirmPassword');
    
    passwordControl?.setValue('validpassword123');
    confirmPasswordControl?.setValue('validpassword123');
    
    component.onSubmit();
    
    expect(component.isLoading).toBeTruthy();
  });
});
