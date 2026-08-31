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
import { PaiementService } from '../../../core/services/paiement.service';
import { MembreService } from '../../../core/services/membre.service';
import { AbonnementService } from '../../../core/services/abonnement.service';
import { PaiementResponse, MembreResponse, AbonnementResponse } from '../../../core/models';

@Component({
  selector: 'app-paiements-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Paiements</h1>
        <div style="display:flex;gap:8px">
          <button mat-stroked-button color="warn" (click)="loadRetards()">
            <mat-icon>warning</mat-icon> En retard
          </button>
          <button mat-raised-button color="primary" (click)="openForm()">
            <mat-icon>add</mat-icon> Nouveau paiement
          </button>
        </div>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
            <ng-container matColumnDef="membre">
              <th mat-header-cell *matHeaderCellDef>Membre</th>
              <td mat-cell *matCellDef="let p">{{ p.membreNomComplet }}</td>
            </ng-container>
            <ng-container matColumnDef="montant">
              <th mat-header-cell *matHeaderCellDef>Montant</th>
              <td mat-cell *matCellDef="let p"><strong>{{ p.montant }} MAD</strong></td>
            </ng-container>
            <ng-container matColumnDef="echeance">
              <th mat-header-cell *matHeaderCellDef>Échéance</th>
              <td mat-cell *matCellDef="let p">{{ p.dateEcheance | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="datePaiement">
              <th mat-header-cell *matHeaderCellDef>Date paiement</th>
              <td mat-cell *matCellDef="let p">{{ p.datePaiement ? (p.datePaiement | date:'dd/MM/yyyy') : '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="methode">
              <th mat-header-cell *matHeaderCellDef>Méthode</th>
              <td mat-cell *matCellDef="let p">{{ p.methodePaiement || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let p">
                <span class="status-chip"
                  [class]="p.statut === 'PAYE' ? 'actif' : p.statut === 'EN_RETARD' ? 'expire' : 'suspendu'">
                  {{ p.statut }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let p">
                <div class="action-buttons">
                  <button mat-raised-button color="primary" *ngIf="p.statut !== 'PAYE'"
                          (click)="marquerPaye(p)" matTooltip="Marquer comme payé" style="font-size:11px;height:32px">
                    <mat-icon style="font-size:16px">check</mat-icon> Payé
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(p)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header><mat-card-title>Nouveau paiement</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Membre</mat-label>
              <mat-select formControlName="membreId" (selectionChange)="onMembreChange($event.value)">
                <mat-option *ngFor="let m of membres" [value]="m.id">{{ m.prenom }} {{ m.nom }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Abonnement</mat-label>
              <mat-select formControlName="abonnementId">
                <mat-option *ngFor="let a of abonnementsMembre" [value]="a.id">
                  {{ a.planNom }} — {{ a.dateDebut | date:'dd/MM/yy' }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Montant (MAD)</mat-label>
              <input matInput formControlName="montant" type="number">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date échéance</mat-label>
              <input matInput formControlName="dateEcheance" type="date">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Méthode paiement</mat-label>
              <mat-select formControlName="methodePaiement">
                <mat-option value="ESPECES">Espèces</mat-option>
                <mat-option value="CARTE">Carte bancaire</mat-option>
                <mat-option value="VIREMENT">Virement</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Notes</mat-label>
              <input matInput formControlName="notes">
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Créer</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class PaiementsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<PaiementResponse>();
  columns = ['membre', 'montant', 'echeance', 'datePaiement', 'methode', 'statut', 'actions'];
  membres: MembreResponse[] = [];
  abonnementsMembre: AbonnementResponse[] = [];
  showForm = false;
  form: FormGroup;

  constructor(
    private service: PaiementService,
    private membreService: MembreService,
    private abonnementService: AbonnementService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      membreId:        [null, Validators.required],
      abonnementId:    [null, Validators.required],
      montant:         [0, [Validators.required, Validators.min(1)]],
      dateEcheance:    ['', Validators.required],
      methodePaiement: ['ESPECES'],
      notes:           ['']
    });
  }

  ngOnInit(): void {
    this.load();
    this.membreService.findAll().subscribe(d => this.membres = d);
  }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  load(): void { this.service.findAll().subscribe(d => this.dataSource.data = d); }

  loadRetards(): void { this.service.findEnRetard().subscribe(d => this.dataSource.data = d); }

  onMembreChange(membreId: number): void {
    this.abonnementService.findByMembre(membreId).subscribe(d => this.abonnementsMembre = d);
  }

  openForm(): void { this.showForm = true; this.form.reset({ methodePaiement: 'ESPECES' }); }
  cancelForm(): void { this.showForm = false; }

  save(): void {
    this.service.create(this.form.value).subscribe({
      next: () => { this.snackBar.open('Paiement créé', 'OK', { duration: 2000 }); this.cancelForm(); this.load(); },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  marquerPaye(p: PaiementResponse): void {
    this.service.marquerPaye(p.id, 'ESPECES').subscribe({
      next: () => { this.snackBar.open('Paiement enregistré', 'OK', { duration: 2000 }); this.load(); }
    });
  }

  delete(p: PaiementResponse): void {
    if (!confirm('Supprimer ce paiement ?')) return;
    this.service.delete(p.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'OK', { duration: 2000 }); this.load(); } });
  }
}