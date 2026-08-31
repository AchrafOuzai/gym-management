import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Créer un utilisateur</h1>
      </div>

      <mat-card class="mat-card-custom" style="max-width:600px">
        <mat-card-header>
          <mat-card-title>Nouvel utilisateur</mat-card-title>
          <mat-card-subtitle>
            Créez un compte Coach, Admin ou Membre avec le rôle souhaité
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">

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

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error>Email invalide</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password" type="password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error>Minimum 6 caractères</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Rôle</mat-label>
              <mat-select formControlName="role">
                <mat-option value="ADMIN">
                  <mat-icon>admin_panel_settings</mat-icon> Administrateur
                </mat-option>
                <mat-option value="COACH">
                  <mat-icon>sports</mat-icon> Coach
                </mat-option>
                <mat-option value="MEMBRE">
                  <mat-icon>person</mat-icon> Membre
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Avertissement si admin -->
            <div class="warn-box" *ngIf="form.get('role')?.value === 'ADMIN'"
                 style="grid-column:1/-1">
              <mat-icon>warning</mat-icon>
              <span>Attention : ce compte aura accès à toutes les fonctionnalités d'administration.</span>
            </div>

            <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:8px">
              <button mat-button type="button" (click)="form.reset()">Réinitialiser</button>
              <button mat-raised-button color="primary"
                      type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Création...' : 'Créer l\'utilisateur' }}
              </button>
            </div>

          </form>
        </mat-card-content>
      </mat-card>

      <!-- Historique des créations -->
      <mat-card class="mat-card-custom" style="max-width:600px;margin-top:24px"
                *ngIf="created.length > 0">
        <mat-card-header>
          <mat-card-title>Créés dans cette session</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let u of created" class="created-item">
            <mat-icon [style.color]="u.role === 'ADMIN' ? '#ff9800' : u.role === 'COACH' ? '#4caf50' : '#2196f3'">
              {{ u.role === 'ADMIN' ? 'admin_panel_settings' : u.role === 'COACH' ? 'sports' : 'person' }}
            </mat-icon>
            <div>
              <div><strong>{{ u.prenom }} {{ u.nom }}</strong></div>
              <div style="font-size:12px;color:#888">{{ u.email }} · {{ u.role }}</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:16px; }
    .warn-box {
      display:flex; align-items:center; gap:8px;
      background:#fff3e0; border-radius:8px; padding:12px;
      font-size:13px; color:#e65100;
      mat-icon { color:#e65100; }
    }
    .created-item {
      display:flex; align-items:center; gap:12px;
      padding:8px 0; border-bottom:1px solid #f0f0f0;
      &:last-child { border-bottom:none; }
    }
  `]
})
export class CreateUserComponent {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loading = false;
  created: any[] = [];

  form: FormGroup = this.fb.group({
    nom:      ['', Validators.required],
    prenom:   ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role:     ['COACH', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.http.post(`${environment.apiUrl}/auth/create-user`, this.form.value).subscribe({
      next: (res: any) => {
        this.snackBar.open(
          `Utilisateur ${res.prenom} ${res.nom} créé avec le rôle ${res.role}`,
          'OK', { duration: 3000 }
        );
        this.created.unshift(res);
        this.form.reset({ role: 'COACH' });
        this.loading = false;
      },
      error: (err) => {
        const msg = err.status === 409 ? 'Cet email existe déjà' : 'Erreur lors de la création';
        this.snackBar.open(msg, 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}