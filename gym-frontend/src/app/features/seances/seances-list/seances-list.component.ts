import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SeanceService } from '../../../core/services/seance.service';
import { CoachService } from '../../../core/services/coach.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { SeanceResponse, CoachResponse, TypeSeance } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-seances-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule,
    MatTooltipModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isMembre ? 'Séances disponibles' : 'Séances' }}</h1>
        <button mat-raised-button color="primary"
                (click)="openForm()"
                *ngIf="isAdmin || isCoach">
          <mat-icon>add</mat-icon> Nouvelle séance
        </button>
      </div>

      <div class="info-banner" *ngIf="isMembre">
        <mat-icon>info</mat-icon>
        <span>Cliquez sur <strong>Réserver</strong> pour vous inscrire
              à une séance. Les places sont limitées.</span>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

            <ng-container matColumnDef="titre">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let s"><strong>{{ s.titre }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let s">
                <mat-chip>{{ s.type }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="dateHeure">
              <th mat-header-cell *matHeaderCellDef>Date / Heure</th>
              <td mat-cell *matCellDef="let s">
                {{ s.dateHeure | date:'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="duree">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let s">{{ s.dureeMinutes }} min</td>
            </ng-container>

            <ng-container matColumnDef="places">
              <th mat-header-cell *matHeaderCellDef>Places</th>
              <td mat-cell *matCellDef="let s">
                <span [style.color]="s.placesRestantes === 0 ? '#f44336' : '#4caf50'"
                      [style.fontWeight]="'600'">
                  {{ s.placesRestantes === 0 ? 'Complet' : s.placesRestantes + ' / ' + s.capaciteMax }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="coach">
              <th mat-header-cell *matHeaderCellDef>Coach</th>
              <td mat-cell *matCellDef="let s">{{ s.coachNomComplet || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="salle">
              <th mat-header-cell *matHeaderCellDef>Salle</th>
              <td mat-cell *matCellDef="let s">{{ s.salle || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let s">
                <div class="action-buttons" *ngIf="isAdmin || isCoach">
                  <button mat-icon-button color="primary"
                          (click)="openForm(s)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDelete(s)"
                          matTooltip="Supprimer"
                          *ngIf="isAdmin">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="reserver">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let s">
                <button mat-raised-button color="primary"
                        [disabled]="s.placesRestantes === 0"
                        (click)="reserver(s)"
                        style="font-size:12px;height:34px">
                  <mat-icon style="font-size:16px">event_available</mat-icon>
                  {{ s.placesRestantes === 0 ? 'Complet' : 'Réserver' }}
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="8"
                  style="text-align:center;padding:32px;color:#888">
                Aucune séance trouvée
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom" style="margin-top:24px"
                *ngIf="showForm && (isAdmin || isCoach)">
        <mat-card-header>
          <mat-card-title>{{ editId ? 'Modifier' : 'Nouvelle' }} séance</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Titre</mat-label>
              <input matInput formControlName="titre">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type">
                <mat-option *ngFor="let t of typeSeances" [value]="t">{{ t }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date et heure</mat-label>
              <input matInput formControlName="dateHeure" type="datetime-local">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Durée (minutes)</mat-label>
              <input matInput formControlName="dureeMinutes" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Capacité max</mat-label>
              <input matInput formControlName="capaciteMax" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Salle</mat-label>
              <input matInput formControlName="salle">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Coach</mat-label>
              <mat-select formControlName="coachId">
                <mat-option [value]="null">— Aucun —</mat-option>
                <mat-option *ngFor="let c of coachs" [value]="c.id">
                  {{ c.prenom }} {{ c.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary"
                  (click)="save()" [disabled]="form.invalid">
            {{ editId ? 'Modifier' : 'Créer' }}
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
    .info-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e3f2fd;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #1565c0;
    }
  `]
})
export class SeancesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private auth = inject(AuthService);

  dataSource = new MatTableDataSource<SeanceResponse>();
  coachs: CoachResponse[] = [];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  typeSeances: TypeSeance[] = [
    'CARDIO', 'MUSCULATION', 'YOGA',
    'PILATES', 'ZUMBA', 'BOXE', 'CROSSFIT'
  ];

  get isAdmin()  { return this.auth.currentUser()?.role === 'ADMIN';  }
  get isCoach()  { return this.auth.currentUser()?.role === 'COACH';  }
  get isMembre() { return this.auth.currentUser()?.role === 'MEMBRE'; }

  get columns(): string[] {
    return this.isMembre
      ? ['titre', 'type', 'dateHeure', 'duree', 'places', 'coach', 'salle', 'reserver']
      : ['titre', 'type', 'dateHeure', 'duree', 'places', 'coach', 'salle', 'actions'];
  }

  constructor(
    private service: SeanceService,
    private coachService: CoachService,
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      titre:        ['', Validators.required],
      description:  [''],
      type:         ['', Validators.required],
      dateHeure:    ['', Validators.required],
      dureeMinutes: [60, [Validators.required, Validators.min(15)]],
      capaciteMax:  [20, [Validators.required, Validators.min(1)]],
      salle:        [''],
      coachId:      [null]
    });
  }

  ngOnInit(): void {
    if (this.isMembre) {
      this.service.findDisponibles().subscribe(d => this.dataSource.data = d);
    } else {
      this.service.findAll().subscribe(d => this.dataSource.data = d);
      this.coachService.findActifs().subscribe(d => this.coachs = d);
    }
  }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  openForm(s?: SeanceResponse): void {
    if (!this.isAdmin && !this.isCoach) return;
    this.showForm = true;
    this.editId = s?.id ?? null;
    s ? this.form.patchValue(s)
      : this.form.reset({ dureeMinutes: 60, capaciteMax: 20 });
  }

  cancelForm(): void { this.showForm = false; this.editId = null; }

  save(): void {
    if (!this.isAdmin && !this.isCoach) return;
    const obs = this.editId
      ? this.service.update(this.editId, this.form.value)
      : this.service.create(this.form.value);
    obs.subscribe({
      next: () => {
        this.snackBar.open('Sauvegardé ✓', 'OK', { duration: 2000 });
        this.cancelForm();
        this.ngOnInit();
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  confirmDelete(s: SeanceResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Supprimer cette séance ?',
        message: `La séance "${s.titre}" du ${new Date(s.dateHeure).toLocaleDateString('fr-FR')}
                  sera définitivement supprimée. Toutes les réservations associées
                  seront également annulées.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(s.id).subscribe({
          next: () => {
            this.snackBar.open('Séance supprimée ✓', 'OK', { duration: 2000 });
            this.ngOnInit();
          }
        });
      }
    });
  }

  reserver(s: SeanceResponse): void {
    if (!this.isMembre) return;
    this.reservationService.reserver({ membreId: 0, seanceId: s.id }).subscribe({
      next: (r) => {
        const msg = r.statut === 'LISTE_ATTENTE'
          ? 'Ajouté en liste d\'attente !'
          : 'Réservation confirmée !';
        this.snackBar.open(msg, 'OK', { duration: 3000 });
        this.service.findDisponibles().subscribe(d => this.dataSource.data = d);
      },
      error: (e) => this.snackBar.open(
        e.error?.message || 'Erreur lors de la réservation',
        'Fermer', { duration: 3000 }
      )
    });
  }
}