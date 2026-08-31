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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PresenceService } from '../../../core/services/presence.service';
import { MembreService } from '../../../core/services/membre.service';
import { SeanceService } from '../../../core/services/seance.service';
import { PresenceResponse, MembreResponse, SeanceResponse } from '../../../core/models';

@Component({
  selector: 'app-presences-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule,
    MatTooltipModule, MatSlideToggleModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Présences</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Enregistrer présence
        </button>
      </div>

      <!-- Filtre par séance -->
      <mat-card class="mat-card-custom" style="margin-bottom:16px">
        <mat-card-content style="padding-top:16px">
          <div style="display:flex;gap:16px;align-items:center">
            <mat-form-field appearance="outline" style="width:300px;margin-bottom:-16px">
              <mat-label>Filtrer par séance</mat-label>
              <mat-select (selectionChange)="filterBySeance($event.value)">
                <mat-option [value]="null">Toutes les séances</mat-option>
                <mat-option *ngFor="let s of seances" [value]="s.id">
                  {{ s.titre }} — {{ s.dateHeure | date:'dd/MM/yyyy HH:mm' }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:300px;margin-bottom:-16px">
              <mat-label>Filtrer par membre</mat-label>
              <mat-select (selectionChange)="filterByMembre($event.value)">
                <mat-option [value]="null">Tous les membres</mat-option>
                <mat-option *ngFor="let m of membres" [value]="m.id">
                  {{ m.prenom }} {{ m.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="mat-card-custom">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

            <ng-container matColumnDef="membre">
              <th mat-header-cell *matHeaderCellDef>Membre</th>
              <td mat-cell *matCellDef="let p">{{ p.membreNomComplet }}</td>
            </ng-container>

            <ng-container matColumnDef="seance">
              <th mat-header-cell *matHeaderCellDef>Séance</th>
              <td mat-cell *matCellDef="let p"><strong>{{ p.seanceTitre }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="arrivee">
              <th mat-header-cell *matHeaderCellDef>Heure arrivée</th>
              <td mat-cell *matCellDef="let p">{{ p.dateHeureArrivee | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="depart">
              <th mat-header-cell *matHeaderCellDef>Heure départ</th>
              <td mat-cell *matCellDef="let p">
                {{ p.dateHeureDepart ? (p.dateHeureDepart | date:'HH:mm') : '—' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="present">
              <th mat-header-cell *matHeaderCellDef>Présent</th>
              <td mat-cell *matCellDef="let p">
                <mat-icon [style.color]="p.present ? '#4caf50' : '#f44336'">
                  {{ p.present ? 'check_circle' : 'cancel' }}
                </mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button color="warn" (click)="delete(p)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6" style="text-align:center;padding:24px">
                Aucune présence enregistrée
              </td>
            </tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Formulaire -->
      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header>
          <mat-card-title>Enregistrer une présence</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Membre</mat-label>
              <mat-select formControlName="membreId">
                <mat-option *ngFor="let m of membres" [value]="m.id">
                  {{ m.prenom }} {{ m.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Séance</mat-label>
              <mat-select formControlName="seanceId">
                <mat-option *ngFor="let s of seances" [value]="s.id">
                  {{ s.titre }} — {{ s.dateHeure | date:'dd/MM/yyyy HH:mm' }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Heure d'arrivée</mat-label>
              <input matInput formControlName="dateHeureArrivee" type="datetime-local">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Heure de départ</mat-label>
              <input matInput formControlName="dateHeureDepart" type="datetime-local">
            </mat-form-field>

            <div style="display:flex;align-items:center;gap:12px">
              <mat-slide-toggle formControlName="present" color="primary">
                Présent
              </mat-slide-toggle>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
            Enregistrer
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:16px; }
  `]
})
export class PresencesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<PresenceResponse>();
  columns = ['membre', 'seance', 'arrivee', 'depart', 'present', 'actions'];
  membres: MembreResponse[] = [];
  seances: SeanceResponse[] = [];
  showForm = false;
  form: FormGroup;

  constructor(
    private service: PresenceService,
    private membreService: MembreService,
    private seanceService: SeanceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      membreId:          [null, Validators.required],
      seanceId:          [null, Validators.required],
      dateHeureArrivee:  ['', Validators.required],
      dateHeureDepart:   [''],
      present:           [true]
    });
  }

  ngOnInit(): void {
    this.load();
    this.membreService.findAll().subscribe(d => this.membres = d);
    this.seanceService.findAll().subscribe(d => this.seances = d);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  load(): void {
    this.service.findBySeance(0).subscribe({
      next: () => {},
      error: () => {}
    });
    this.dataSource.data = [];
  }

  filterBySeance(seanceId: number): void {
    if (!seanceId) { this.dataSource.data = []; return; }
    this.service.findBySeance(seanceId).subscribe(d => this.dataSource.data = d);
  }

  filterByMembre(membreId: number): void {
    if (!membreId) { this.dataSource.data = []; return; }
    this.service.findByMembre(membreId).subscribe(d => this.dataSource.data = d);
  }

  openForm(): void { this.showForm = true; this.form.reset({ present: true }); }
  cancelForm(): void { this.showForm = false; }

  save(): void {
    this.service.enregistrer(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Présence enregistrée', 'OK', { duration: 2000 });
        this.cancelForm();
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  delete(p: PresenceResponse): void {
    if (!confirm('Supprimer cette présence ?')) return;
    this.service.delete(p.id).subscribe({
      next: () => {
        this.snackBar.open('Supprimé', 'OK', { duration: 2000 });
        this.dataSource.data = this.dataSource.data.filter(x => x.id !== p.id);
      }
    });
  }
}