import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanService } from '../../../core/services/plan.service';
import { PlanResponse } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCheckboxModule,
    MatSnackBarModule, MatTooltipModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Plans d'abonnement</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouveau plan
        </button>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let p"><strong>{{ p.nom }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="dureeMois">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let p">{{ p.dureeMois }} mois</td>
            </ng-container>

            <ng-container matColumnDef="prix">
              <th mat-header-cell *matHeaderCellDef>Prix</th>
              <td mat-cell *matCellDef="let p">
                <strong>{{ p.prix }} MAD</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="seances">
              <th mat-header-cell *matHeaderCellDef>Séances incluses</th>
              <td mat-cell *matCellDef="let p">
                {{ p.nombreSeancesIncluses || 'Illimitées' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="options">
              <th mat-header-cell *matHeaderCellDef>Options</th>
              <td mat-cell *matCellDef="let p">
                <mat-icon [style.color]="p.accesPiscine ? '#4caf50' : '#ccc'"
                          matTooltip="Piscine">pool</mat-icon>
                <mat-icon [style.color]="p.accesCoach ? '#4caf50' : '#ccc'"
                          matTooltip="Coach">sports</mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="actif">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let p">
                <span class="status-chip"
                      [class]="p.actif ? 'actif' : 'inactif'">
                  {{ p.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let p">
                <div class="action-buttons">
                  <button mat-icon-button color="primary"
                          (click)="openForm(p)"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDelete(p)"
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
          <mat-card-title>{{ editId ? 'Modifier' : 'Nouveau' }} plan</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nom du plan</mat-label>
              <input matInput formControlName="nom">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Durée (mois)</mat-label>
              <input matInput formControlName="dureeMois" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Prix (MAD)</mat-label>
              <input matInput formControlName="prix" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Séances incluses</mat-label>
              <input matInput formControlName="nombreSeancesIncluses" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>
            <div style="display:flex;gap:24px;align-items:center">
              <mat-checkbox formControlName="accesPiscine">Accès piscine</mat-checkbox>
              <mat-checkbox formControlName="accesCoach">Accès coach</mat-checkbox>
            </div>
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
export class PlansListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<PlanResponse>();
  columns = ['nom', 'dureeMois', 'prix', 'seances', 'options', 'actif', 'actions'];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  constructor(
    private service: PlanService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nom:                   ['', Validators.required],
      description:           [''],
      dureeMois:             [1, [Validators.required, Validators.min(1)]],
      prix:                  [0, [Validators.required, Validators.min(0)]],
      nombreSeancesIncluses: [null],
      accesPiscine:          [false],
      accesCoach:            [false]
    });
  }

  ngOnInit(): void { this.load(); }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  load(): void { this.service.findAll().subscribe(d => this.dataSource.data = d); }

  openForm(p?: PlanResponse): void {
    this.showForm = true;
    this.editId = p?.id ?? null;
    p ? this.form.patchValue(p)
      : this.form.reset({ dureeMois: 1, prix: 0, accesPiscine: false, accesCoach: false });
  }

  cancelForm(): void { this.showForm = false; this.editId = null; }

  save(): void {
    const obs = this.editId
      ? this.service.update(this.editId, this.form.value)
      : this.service.create(this.form.value);
    obs.subscribe({
      next: () => {
        this.snackBar.open('Sauvegardé ✓', 'OK', { duration: 2000 });
        this.cancelForm();
        this.load();
      }
    });
  }

  confirmDelete(p: PlanResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Supprimer ce plan ?',
        message: `Le plan "${p.nom}" à ${p.prix} MAD sera définitivement supprimé.
                  Les membres ayant cet abonnement actif ne seront pas affectés
                  mais aucun nouvel abonnement ne pourra être créé avec ce plan.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(p.id).subscribe({
          next: () => {
            this.snackBar.open('Plan supprimé ✓', 'OK', { duration: 2000 });
            this.load();
          }
        });
      }
    });
  }
}