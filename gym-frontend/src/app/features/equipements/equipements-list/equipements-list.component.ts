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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EquipementService } from '../../../core/services/equipement.service';
import { EquipementResponse, EtatEquipement } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-equipements-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Équipements</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouvel équipement
        </button>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <mat-form-field appearance="outline"
                          style="width:300px;margin-bottom:16px">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)"
                   placeholder="Nom, salle...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let e"><strong>{{ e.nom }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="marque">
              <th mat-header-cell *matHeaderCellDef>Marque / Modèle</th>
              <td mat-cell *matCellDef="let e">
                {{ e.marque || '—' }}
                {{ e.modele ? '— ' + e.modele : '' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="quantite">
              <th mat-header-cell *matHeaderCellDef>Qté</th>
              <td mat-cell *matCellDef="let e">{{ e.quantite }}</td>
            </ng-container>

            <ng-container matColumnDef="salle">
              <th mat-header-cell *matHeaderCellDef>Salle</th>
              <td mat-cell *matCellDef="let e">{{ e.salle || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="etat">
              <th mat-header-cell *matHeaderCellDef>État</th>
              <td mat-cell *matCellDef="let e">
                <span class="status-chip"
                  [class]="e.etat === 'BON_ETAT' ? 'actif' :
                            e.etat === 'EN_MAINTENANCE' ? 'suspendu' : 'expire'">
                  {{ e.etat === 'BON_ETAT' ? 'Bon état' :
                     e.etat === 'EN_MAINTENANCE' ? 'Maintenance' : 'Hors service' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let e">
                <div class="action-buttons">
                  <button mat-icon-button color="primary"
                          (click)="openForm(e)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          (click)="confirmDelete(e)" matTooltip="Supprimer">
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
          <mat-card-title>
            {{ editId ? 'Modifier' : 'Nouvel' }} équipement
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Quantité</mat-label>
              <input matInput formControlName="quantite" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Marque</mat-label>
              <input matInput formControlName="marque">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Modèle</mat-label>
              <input matInput formControlName="modele">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Salle</mat-label>
              <input matInput formControlName="salle">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>État</mat-label>
              <mat-select formControlName="etat">
                <mat-option value="BON_ETAT">Bon état</mat-option>
                <mat-option value="EN_MAINTENANCE">En maintenance</mat-option>
                <mat-option value="HORS_SERVICE">Hors service</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date d'achat</mat-label>
              <input matInput formControlName="dateAchat" type="date">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Dernière révision</mat-label>
              <input matInput formControlName="dateDerniereRevision" type="date">
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
  `]
})
export class EquipementsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<EquipementResponse>();
  columns = ['nom', 'marque', 'quantite', 'salle', 'etat', 'actions'];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  constructor(
    private service: EquipementService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nom:                  ['', Validators.required],
      description:          [''],
      marque:               [''],
      modele:               [''],
      quantite:             [1, [Validators.required, Validators.min(1)]],
      etat:                 ['BON_ETAT'],
      dateAchat:            [''],
      dateDerniereRevision: [''],
      salle:                ['']
    });
  }

  ngOnInit(): void { this.load(); }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  load(): void {
    this.service.findAll().subscribe(d => this.dataSource.data = d);
  }

  applyFilter(e: Event): void {
    this.dataSource.filter =
      (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openForm(eq?: EquipementResponse): void {
    this.showForm = true;
    this.editId = eq?.id ?? null;
    eq ? this.form.patchValue(eq)
       : this.form.reset({ quantite: 1, etat: 'BON_ETAT' });
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

  confirmDelete(e: EquipementResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Supprimer cet équipement ?',
        message: `"${e.nom}"${e.marque ? ' (' + e.marque + ')' : ''} sera définitivement
                  supprimé de l'inventaire. Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(e.id).subscribe({
          next: () => {
            this.snackBar.open('Équipement supprimé ✓', 'OK', { duration: 2000 });
            this.load();
          }
        });
      }
    });
  }
}