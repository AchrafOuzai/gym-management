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
import { AbonnementService } from '../../../core/services/abonnement.service';
import { MembreService } from '../../../core/services/membre.service';
import { PlanService } from '../../../core/services/plan.service';
import { AbonnementResponse, MembreResponse, PlanResponse } from '../../../core/models';

@Component({
  selector: 'app-abonnements-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Abonnements</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouvel abonnement
        </button>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
            <ng-container matColumnDef="membre">
              <th mat-header-cell *matHeaderCellDef>Membre</th>
              <td mat-cell *matCellDef="let a">{{ a.membreNomComplet }}</td>
            </ng-container>
            <ng-container matColumnDef="plan">
              <th mat-header-cell *matHeaderCellDef>Plan</th>
              <td mat-cell *matCellDef="let a"><strong>{{ a.planNom }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="dateDebut">
              <th mat-header-cell *matHeaderCellDef>Début</th>
              <td mat-cell *matCellDef="let a">{{ a.dateDebut | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="dateFin">
              <th mat-header-cell *matHeaderCellDef>Fin</th>
              <td mat-cell *matCellDef="let a">{{ a.dateFin | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let a">
                <span class="status-chip" [class]="a.statut.toLowerCase()">{{ a.statut }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let a">
                <button mat-icon-button color="warn" (click)="delete(a)"><mat-icon>delete</mat-icon></button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header><mat-card-title>Nouvel abonnement</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Membre</mat-label>
              <mat-select formControlName="membreId">
                <mat-option *ngFor="let m of membres" [value]="m.id">{{ m.prenom }} {{ m.nom }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Plan</mat-label>
              <mat-select formControlName="planId">
                <mat-option *ngFor="let p of plans" [value]="p.id">{{ p.nom }} — {{ p.prix }} MAD</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date de début</mat-label>
              <input matInput formControlName="dateDebut" type="date">
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
  `,
  styles: [`.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:16px; }`]
})
export class AbonnementsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<AbonnementResponse>();
  columns = ['membre', 'plan', 'dateDebut', 'dateFin', 'statut', 'actions'];
  membres: MembreResponse[] = [];
  plans: PlanResponse[] = [];
  showForm = false;
  form: FormGroup;

  constructor(
    private service: AbonnementService,
    private membreService: MembreService,
    private planService: PlanService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      membreId:  [null, Validators.required],
      planId:    [null, Validators.required],
      dateDebut: ['', Validators.required],
      notes:     ['']
    });
  }

  ngOnInit(): void {
    this.load();
    this.membreService.findAll().subscribe(d => this.membres = d);
    this.planService.findActifs().subscribe(d => this.plans = d);
  }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }
  load(): void { this.service.findAll().subscribe(d => this.dataSource.data = d); }
  openForm(): void { this.showForm = true; this.form.reset(); }
  cancelForm(): void { this.showForm = false; }
  save(): void {
    this.service.create(this.form.value).subscribe({
      next: () => { this.snackBar.open('Abonnement créé', 'OK', { duration: 2000 }); this.cancelForm(); this.load(); },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }
  delete(a: AbonnementResponse): void {
    if (!confirm('Supprimer cet abonnement ?')) return;
    this.service.delete(a.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'OK', { duration: 2000 }); this.load(); } });
  }
}