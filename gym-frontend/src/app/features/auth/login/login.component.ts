import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="auth-logo">
            <mat-icon>fitness_center</mat-icon>
            <h1>GymManager</h1>
          </div>
          <mat-card-title>Connexion</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="admin@gym.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email obligatoire</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Email invalide</mat-error>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Mot de passe obligatoire</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width submit-btn"
                    type="submit" [disabled]="form.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Se connecter</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Pas encore de compte ? <a routerLink="/auth/register">Créer un compte</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3f51b5 0%, #1a237e 100%);
    }
    .auth-card {
      width: 400px;
      padding: 24px;
      border-radius: 16px !important;
    }
    .auth-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      mat-icon { font-size: 32px; width: 32px; height: 32px; color: #3f51b5; }
      h1 { font-size: 24px; font-weight: 700; color: #3f51b5; }
    }
    .submit-btn { margin-top: 16px; height: 48px; font-size: 16px; }
    mat-card-actions { text-align: center; padding: 16px 0 0; }
    a { color: #3f51b5; text-decoration: none; font-weight: 500; }
    mat-spinner { display: inline-block; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.snackBar.open('Email ou mot de passe incorrect', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}