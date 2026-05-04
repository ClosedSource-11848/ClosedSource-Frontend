import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { Toolbar } from '../../../../shared/presentation/components/toolbar/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatProgressSpinnerModule,
    RouterLink,
    Toolbar,
  ],
  templateUrl: './sign-up-form.html',
  styleUrls: ['./sign-up-form.css'],
})
export class SignUpForm {
  protected store = inject(IamStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /**
   * Propiedad 'role' añadida para resolver el error TS2339 en el HTML.
   * Se usa para las llaves de traducción dinámica: 'iam.sign-up.roles.' + role
   */
  role: string = 'lab-operator';

  selectedRole: string = 'ROLE_LAB_OPERATOR';
  displayRoleName: string = 'Lab Operator';

  form = new FormGroup(
    {
      username: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), this.passwordStrengthValidator],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator },
  );

  hidePassword = true;
  hideConfirmPassword = true;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      // Sincronizamos 'role' para el HTML y 'selectedRole' para el comando del Backend
      if (params['role'] === 'qa-manager') {
        this.role = 'qa-manager';
        this.selectedRole = 'ROLE_QA_MANAGER';
        this.displayRoleName = 'QA Manager / Supervisor';
      } else {
        this.role = 'lab-operator';
        this.selectedRole = 'ROLE_LAB_OPERATOR';
        this.displayRoleName = 'Lab Operator';
      }
    });
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const passwordValid = /[0-9]/.test(value) && /[a-zA-Z]/.test(value);
    return !passwordValid ? { passwordStrength: true } : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const signUpCommand = new SignUpCommand({
        username: this.form.value.username!,
        password: this.form.value.password!,
        roles: [this.selectedRole],
      });
      this.store.signUp(signUpCommand, this.router);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => formGroup.get(key)?.markAsTouched());
  }

  getUsernameError(): string {
    const control = this.form.get('username');
    if (control?.hasError('required')) return 'Username is required';
    if (control?.hasError('minlength')) return 'Min 3 characters';
    return '';
  }

  getPasswordError(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) return 'Password is required';
    if (control?.hasError('passwordStrength')) return 'Must contain letters and numbers';
    return '';
  }
}
