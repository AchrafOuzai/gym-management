import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MembreService } from '../../../core/services/membre.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { MembreResponse } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-membres-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatSnackBarModule, MatTooltipModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isAdmin ? 'Membres' : 'Mon profil' }}</h1>
        <div style="display:flex;gap:8px">
          <button mat-stroked-button
                  (click)="exportService.exportMembresExcel()"
                  *ngIf="isAdmin"
                  matTooltip="Exporter en Excel">
            <mat-icon>table_view</mat-icon> Excel
          </button>
          <button mat-stroked-button color="warn"
                  (click)="exportService.exportMembresPdf()"
                  *ngIf="isAdmin"
                  matTooltip="Exporter en PDF">
            <mat-icon>picture_as_pdf</mat-icon> PDF
          </button>
          <button mat-raised-button color="primary"
                  (click)="openForm()"
                  *ngIf="isAdmin">
            <mat-icon>add</mat-icon> Nouveau membre
          </button>
        </div>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <mat-form-field appearance="outline"
                          style="width:300px;margin-bottom:16px"
                          *ngIf="isAdmin || isCoach">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)"
                   placeholder="Nom, prénom...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort
                 class="mat-elevation-z2">

            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom complet</th>
              <td mat-cell *matCellDef="let m">{{ m.prenom }} {{ m.nom }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let m">{{ m.email }}</td>
            </ng-container>

            <ng-container matColumnDef="telephone">
              <th mat-header-cell *matHeaderCellDef>Téléphone</th>
              <td mat-cell *matCellDef="let m">{{ m.telephone || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="dateInscription">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Inscription</th>
              <td mat-cell *matCellDef="let m">
                {{ m.dateInscription | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let m">
                <span class="status-chip" [class]="m.statut.toLowerCase()">
                  {{ m.statut }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let m">
                <div class="action-buttons" *ngIf="isAdmin">
                  <button mat-icon-button color="primary"
                          (click)="openForm(m)"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDelete(m)"
                          matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6"
                  style="text-align:center;padding:24px;color:#888">
                Aucun membre trouvé
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]"
                         showFirstLastButtons
                         *ngIf="isAdmin || isCoach">
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Formulaire création/modification -->
      <mat-card class="mat-card-custom" style="margin-top:24px"
                *ngIf="showForm && isAdmin">
        <mat-card-header>
          <mat-card-title>
            {{ editId ? 'Modifier le membre' : 'Nouveau membre' }}
          </mat-card-title>
          <mat-card-subtitle *ngIf="!editId">
            Un compte de connexion sera créé automatiquement pour ce membre.
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
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
              <mat-error>Email invalide</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="telephone">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date d'inscription</mat-label>
              <input matInput formControlName="dateInscription" type="date">
              <mat-error>Obligatoire</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date de naissance</mat-label>
              <input matInput formControlName="dateNaissance" type="date">
            </mat-form-field>
          </form>

          <!-- Info sur le mot de passe par défaut -->
          <div class="info-box" *ngIf="!editId">
            <mat-icon>info</mat-icon>
            <span>
              Le mot de passe par défaut sera la partie avant @ de l'email + "123".
              <br>Exemple : <strong>ahmed@gmail.com</strong> →
              mot de passe : <strong>ahmed123</strong>
            </span>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary"
                  (click)="save()" [disabled]="form.invalid">
            {{ editId ? 'Modifier' : 'Créer le compte' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding-top: 16px;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #e3f2fd;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 16px;
      font-size: 13px;
      color: #1565c0;
      line-height: 1.6;
    }

    .info-box mat-icon {
      color: #1565c0;
      flex-shrink: 0;
      margin-top: 2px;
    }
  `]
})
export class MembresListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private auth = inject(AuthService);

  dataSource = new MatTableDataSource<MembreResponse>();
  columns: string[] = [];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  get isAdmin()  { return this.auth.currentUser()?.role === 'ADMIN'; }
  get isCoach()  { return this.auth.currentUser()?.role === 'COACH'; }
  get isMembre() { return this.auth.currentUser()?.role === 'MEMBRE'; }

  constructor(
    private service: MembreService,
    public exportService: ExportService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nom:             ['', Validators.required],
      prenom:          ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      telephone:       [''],
      dateInscription: ['', Validators.required],
      dateNaissance:   ['']
    });
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.columns = ['nom', 'email', 'telephone', 'dateInscription', 'statut', 'actions'];
      this.load();
    } else if (this.isCoach) {
      this.columns = ['nom', 'email', 'telephone', 'dateInscription', 'statut'];
      this.load();
    } else {
      this.columns = ['nom', 'email', 'telephone', 'dateInscription', 'statut'];
      const email = this.auth.currentUser()?.email;
      if (email) {
        this.service.search(email).subscribe(d => this.dataSource.data = d);
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load(): void {
    this.service.findAll().subscribe(d => this.dataSource.data = d);
  }

  applyFilter(event: Event): void {
    this.dataSource.filter =
      (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openForm(membre?: MembreResponse): void {
    if (!this.isAdmin) return;
    this.showForm = true;
    this.editId = membre?.id ?? null;
    membre ? this.form.patchValue(membre) : this.form.reset();
  }

  cancelForm(): void {
    this.showForm = false;
    this.form.reset();
    this.editId = null;
  }

  save(): void {
    if (this.form.invalid || !this.isAdmin) return;

    if (this.editId) {
      this.service.update(this.editId, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Membre modifié ✓', 'OK', { duration: 2000 });
          this.cancelForm();
          this.load();
        },
        error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
      });
    } else {
      this.service.create(this.form.value).subscribe({
        next: () => {
          const email = this.form.get('email')?.value;
          const defaultPassword = email.split('@')[0] + '123';

          this.dialog.open(ConfirmDialogComponent, {
            width: '460px',
            data: {
              title: 'Membre créé avec succès ✓',
              message: `Le compte a été créé. Communiquez ces identifiants au membre :\n\n📧 Email : ${email}\n🔑 Mot de passe : ${defaultPassword}\n\nLe membre peut se connecter immédiatement avec ces identifiants.`,
              confirmText: 'OK, compris',
              cancelText: '',
              type: 'info'
            }
          });

          this.cancelForm();
          this.load();
        },
        error: (err) => {
          const msg = err.status === 409
            ? 'Cet email est déjà utilisé'
            : 'Erreur lors de la création';
          this.snackBar.open(msg, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  confirmDelete(m: MembreResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Supprimer ce membre ?',
        message: `Vous êtes sur le point de supprimer définitivement "${m.prenom} ${m.nom}".\n\nSes abonnements, réservations et paiements seront également supprimés. Son compte de connexion sera désactivé.\n\nCette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.delete(m);
    });
  }

  delete(m: MembreResponse): void {
    this.service.delete(m.id).subscribe({
      next: () => {
        this.snackBar.open('Membre supprimé ✓', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => this.snackBar.open(
        'Erreur lors de la suppression', 'Fermer', { duration: 3000 }
      )
    });
  }
}