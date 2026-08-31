import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoachService } from '../../../core/services/coach.service';
import { CoachResponse, TypeSeance } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-coachs-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Coachs</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouveau coach
        </button>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <mat-form-field appearance="outline"
                          style="width:300px;margin-bottom:16px">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)"
                   placeholder="Nom, email...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort
                 class="mat-elevation-z2">

            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom complet</th>
              <td mat-cell *matCellDef="let c">{{ c.prenom }} {{ c.nom }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let c">{{ c.email }}</td>
            </ng-container>

            <ng-container matColumnDef="specialites">
              <th mat-header-cell *matHeaderCellDef>Spécialités</th>
              <td mat-cell *matCellDef="let c">
                <mat-chip-set>
                  <mat-chip *ngFor="let s of c.specialites">{{ s }}</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="actif">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let c">
                <span class="status-chip"
                      [class]="c.actif ? 'actif' : 'inactif'">
                  {{ c.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let c">
                <div class="action-buttons">
                  <button mat-icon-button color="primary"
                          (click)="openForm(c)"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDesactiver(c)"
                          matTooltip="Désactiver"
                          *ngIf="c.actif">
                    <mat-icon>block</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDelete(c)"
                          matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25]"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header>
          <mat-card-title>{{ editId ? 'Modifier' : 'Nouveau' }} coach</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="telephone">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date d'embauche</mat-label>
              <input matInput formControlName="dateEmbauche" type="date">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Spécialités</mat-label>
              <mat-select formControlName="specialites" multiple>
                <mat-option *ngFor="let t of typeSeances" [value]="t">
                  {{ t }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Bio</mat-label>
              <textarea matInput formControlName="bio" rows="3"></textarea>
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
  `]
})
export class CoachsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<CoachResponse>();
  columns = ['nom', 'email', 'specialites', 'actif', 'actions'];
  typeSeances: TypeSeance[] = [
    'CARDIO', 'MUSCULATION', 'YOGA', 'PILATES', 'ZUMBA', 'BOXE', 'CROSSFIT'
  ];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  constructor(
    private service: CoachService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nom:          ['', Validators.required],
      prenom:       ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      telephone:    [''],
      bio:          [''],
      dateEmbauche: ['', Validators.required],
      specialites:  [[]]
    });
  }

  ngOnInit(): void { this.load(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load(): void {
    this.service.findAll().subscribe(d => this.dataSource.data = d);
  }

  applyFilter(e: Event): void {
    this.dataSource.filter =
      (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openForm(c?: CoachResponse): void {
    this.showForm = true;
    this.editId = c?.id ?? null;
    c ? this.form.patchValue(c) : this.form.reset();
  }

  cancelForm(): void {
    this.showForm = false;
    this.form.reset();
    this.editId = null;
  }

  save(): void {
    const obs = this.editId
      ? this.service.update(this.editId, this.form.value)
      : this.service.create(this.form.value);
    obs.subscribe({
      next: () => {
        this.snackBar.open('Sauvegardé ✓', 'OK', { duration: 2000 });
        this.cancelForm();
        this.load();
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  confirmDesactiver(c: CoachResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Désactiver ce coach ?',
        message: `${c.prenom} ${c.nom} ne pourra plus accéder à l'application
                  et ses séances seront annulées. Vous pourrez le réactiver plus tard.`,
        confirmText: 'Désactiver',
        cancelText: 'Annuler',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.desactiver(c.id).subscribe({
          next: () => {
            this.snackBar.open('Coach désactivé ✓', 'OK', { duration: 2000 });
            this.load();
          }
        });
      }
    });
  }

  confirmDelete(c: CoachResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Supprimer ce coach ?',
        message: `Vous êtes sur le point de supprimer définitivement
                  "${c.prenom} ${c.nom}". Toutes ses séances et programmes
                  seront également supprimés. Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(c.id).subscribe({
          next: () => {
            this.snackBar.open('Coach supprimé ✓', 'OK', { duration: 2000 });
            this.load();
          }
        });
      }
    });
  }
}