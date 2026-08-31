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
import { ReservationService } from '../../../core/services/reservation.service';
import { MembreService } from '../../../core/services/membre.service';
import { SeanceService } from '../../../core/services/seance.service';
import { ReservationResponse, MembreResponse, SeanceResponse } from '../../../core/models';

@Component({
  selector: 'app-reservations-list',
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
        <h1>Réservations</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouvelle réservation
        </button>
      </div>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
            <ng-container matColumnDef="membre">
              <th mat-header-cell *matHeaderCellDef>Membre</th>
              <td mat-cell *matCellDef="let r">{{ r.membreNomComplet }}</td>
            </ng-container>
            <ng-container matColumnDef="seance">
              <th mat-header-cell *matHeaderCellDef>Séance</th>
              <td mat-cell *matCellDef="let r"><strong>{{ r.seanceTitre }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="dateSeance">
              <th mat-header-cell *matHeaderCellDef>Date séance</th>
              <td mat-cell *matCellDef="let r">{{ r.seanceDateHeure | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>
            <ng-container matColumnDef="dateReservation">
              <th mat-header-cell *matHeaderCellDef>Réservé le</th>
              <td mat-cell *matCellDef="let r">{{ r.dateReservation | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let r">
                <span class="status-chip"
                  [class]="r.statut === 'CONFIRMEE' ? 'actif' : r.statut === 'ANNULEE' ? 'expire' : 'suspendu'">
                  {{ r.statut }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <button mat-stroked-button color="warn" *ngIf="r.statut === 'CONFIRMEE'"
                        (click)="annuler(r)" style="font-size:11px;height:32px">
                  Annuler
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header><mat-card-title>Nouvelle réservation</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Membre</mat-label>
              <mat-select formControlName="membreId">
                <mat-option *ngFor="let m of membres" [value]="m.id">{{ m.prenom }} {{ m.nom }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Séance</mat-label>
              <mat-select formControlName="seanceId">
                <mat-option *ngFor="let s of seances" [value]="s.id">
                  {{ s.titre }} — {{ s.dateHeure | date:'dd/MM/yyyy HH:mm' }} ({{ s.placesRestantes }} places)
                </mat-option>
              </mat-select>
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Réserver</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class ReservationsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<ReservationResponse>();
  columns = ['membre', 'seance', 'dateSeance', 'dateReservation', 'statut', 'actions'];
  membres: MembreResponse[] = [];
  seances: SeanceResponse[] = [];
  showForm = false;
  form: FormGroup;

  constructor(
    private service: ReservationService,
    private membreService: MembreService,
    private seanceService: SeanceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      membreId: [null, Validators.required],
      seanceId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
    this.membreService.findAll().subscribe(d => this.membres = d);
    this.seanceService.findDisponibles().subscribe(d => this.seances = d);
  }

  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }
  load(): void { this.service.findAll().subscribe(d => this.dataSource.data = d); }
  openForm(): void { this.showForm = true; this.form.reset(); }
  cancelForm(): void { this.showForm = false; }

  save(): void {
    this.service.reserver(this.form.value).subscribe({
      next: (r) => {
        const msg = r.statut === 'LISTE_ATTENTE' ? 'Ajouté en liste d\'attente' : 'Réservation confirmée';
        this.snackBar.open(msg, 'OK', { duration: 3000 });
        this.cancelForm(); this.load();
      },
      error: (e) => this.snackBar.open(e.error?.message || 'Erreur', 'Fermer', { duration: 3000 })
    });
  }

  annuler(r: ReservationResponse): void {
    if (!confirm('Annuler cette réservation ?')) return;
    this.service.annuler(r.id, 'Annulation admin').subscribe({
      next: () => { this.snackBar.open('Réservation annulée', 'OK', { duration: 2000 }); this.load(); }
    });
  }
}