import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="auth-logo">
            <mat-icon>fitness_center</mat-icon>
            <h1>GymManager</h1>
          </div>
          <mat-card-title>Créer un compte membre</mat-card-title>
          <mat-card-subtitle>Rejoignez notre salle de sport</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <div class="row-2">
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="nom">
                <mat-error>Obligatoire</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="prenom">
                <mat-error>Obligatoire</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error>Email invalide</mat-error>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password"
                     [type]="hidePassword ? 'password' : 'text'">
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error>Minimum 6 caractères</mat-error>
            </mat-form-field>

            <div class="info-box">
              <mat-icon>info</mat-icon>
              <span>
                Votre compte sera créé en tant que <strong>Membre</strong>.
                Pour un accès Coach ou Admin, contactez l'administration.
              </span>
            </div>

            <button mat-raised-button color="primary" class="full-width submit-btn"
                    type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
            </button>

          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
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
      width: 440px;
      padding: 24px;
      border-radius: 16px !important;
    }
    .auth-logo {
      display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
      mat-icon { font-size: 32px; width: 32px; height: 32px; color: #3f51b5; }
      h1 { font-size: 24px; font-weight: 700; color: #3f51b5; }
    }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .full-width { width: 100%; }
    .submit-btn { margin-top: 16px; height: 48px; font-size: 16px; }
    mat-card-actions { text-align: center; padding: 16px 0 0; }
    a { color: #3f51b5; text-decoration: none; font-weight: 500; }
    .info-box {
      display: flex; align-items: flex-start; gap: 8px;
      background: #e3f2fd; border-radius: 8px; padding: 12px;
      margin-bottom: 16px; font-size: 13px; color: #1565c0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; margin-top: 2px; flex-shrink: 0; }
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nom:      ['', Validators.required],
      prenom:   ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const data = { ...this.form.value, role: 'MEMBRE' };
    this.authService.register(data).subscribe({
      next: () => {
        this.snackBar.open('Compte créé ! Bienvenue dans GymManager', 'OK', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.status === 409 ? 'Cet email est déjà utilisé' : 'Erreur lors de la création';
        this.snackBar.open(msg, 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}