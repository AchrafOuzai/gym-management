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
import { MatExpansionModule } from '@angular/material/expansion';
import { ProgrammeService } from '../../../core/services/programme.service';
import { MembreService } from '../../../core/services/membre.service';
import { CoachService } from '../../../core/services/coach.service';
import { ProgrammeResponse, MembreResponse, CoachResponse } from '../../../core/models';

@Component({
  selector: 'app-programmes-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule,
    MatTooltipModule, MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Programmes d'entraînement</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouveau programme
        </button>
      </div>

      <!-- Filtre -->
      <mat-card class="mat-card-custom" style="margin-bottom:16px">
        <mat-card-content style="padding-top:16px">
          <div style="display:flex;gap:16px">
            <mat-form-field appearance="outline" style="width:300px;margin-bottom:-16px">
              <mat-label>Filtrer par membre</mat-label>
              <mat-select (selectionChange)="filterByMembre($event.value)">
                <mat-option [value]="null">Tous les membres</mat-option>
                <mat-option *ngFor="let m of membres" [value]="m.id">
                  {{ m.prenom }} {{ m.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:300px;margin-bottom:-16px">
              <mat-label>Filtrer par coach</mat-label>
              <mat-select (selectionChange)="filterByCoach($event.value)">
                <mat-option [value]="null">Tous les coachs</mat-option>
                <mat-option *ngFor="let c of coachs" [value]="c.id">
                  {{ c.prenom }} {{ c.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Liste des programmes en accordéon -->
      <mat-accordion *ngIf="programmes.length > 0">
        <mat-expansion-panel *ngFor="let p of programmes" class="mat-card-custom" style="margin-bottom:8px">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <strong>{{ p.titre }}</strong>
            </mat-panel-title>
            <mat-panel-description>
              {{ p.membreNomComplet }} · Coach : {{ p.coachNomComplet }} ·
              {{ p.dateDebut | date:'dd/MM/yyyy' }}
              <span class="status-chip actif" style="margin-left:8px" *ngIf="p.actif">Actif</span>
              <span class="status-chip inactif" style="margin-left:8px" *ngIf="!p.actif">Inactif</span>
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div style="padding:16px 0">
            <p *ngIf="p.description"><strong>Description :</strong> {{ p.description }}</p>
            <p *ngIf="p.dateFin"><strong>Date de fin :</strong> {{ p.dateFin | date:'dd/MM/yyyy' }}</p>
            <div *ngIf="p.contenu" style="margin-top:12px">
              <strong>Contenu du programme :</strong>
              <pre style="background:#f5f5f5;padding:12px;border-radius:8px;margin-top:8px;
                          white-space:pre-wrap;font-family:inherit">{{ p.contenu }}</pre>
            </div>
          </div>

          <mat-action-row>
            <button mat-button color="primary" (click)="openForm(p)">
              <mat-icon>edit</mat-icon> Modifier
            </button>
            <button mat-button color="warn" (click)="delete(p)">
              <mat-icon>delete</mat-icon> Supprimer
            </button>
          </mat-action-row>
        </mat-expansion-panel>
      </mat-accordion>

      <mat-card class="mat-card-custom" *ngIf="programmes.length === 0" style="text-align:center;padding:40px">
        <mat-icon style="font-size:48px;color:#ccc;width:48px;height:48px">assignment</mat-icon>
        <p style="color:#888;margin-top:12px">Aucun programme trouvé. Sélectionnez un membre ou un coach.</p>
      </mat-card>

      <!-- Formulaire -->
      <mat-card class="mat-card-custom" style="margin-top:24px" *ngIf="showForm">
        <mat-card-header>
          <mat-card-title>{{ editId ? 'Modifier' : 'Nouveau' }} programme</mat-card-title>
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
              <mat-label>Coach</mat-label>
              <mat-select formControlName="coachId">
                <mat-option *ngFor="let c of coachs" [value]="c.id">
                  {{ c.prenom }} {{ c.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Titre du programme</mat-label>
              <input matInput formControlName="titre">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date de début</mat-label>
              <input matInput formControlName="dateDebut" type="date">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date de fin</mat-label>
              <input matInput formControlName="dateFin" type="date">
            </mat-form-field>

            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" style="grid-column:1/-1">
              <mat-label>Contenu détaillé du programme</mat-label>
              <textarea matInput formControlName="contenu" rows="6"
                placeholder="Lundi : Cardio 30min + Musculation bras&#10;Mardi : Repos&#10;..."></textarea>
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelForm()">Annuler</button>
          <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
            {{ editId ? 'Modifier' : 'Créer' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:16px; }
    pre { font-size: 13px; line-height: 1.6; }
  `]
})
export class ProgrammesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<ProgrammeResponse>();
  programmes: ProgrammeResponse[] = [];
  membres: MembreResponse[] = [];
  coachs: CoachResponse[] = [];
  showForm = false;
  editId: number | null = null;
  form: FormGroup;

  constructor(
    private service: ProgrammeService,
    private membreService: MembreService,
    private coachService: CoachService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      membreId:    [null, Validators.required],
      coachId:     [null, Validators.required],
      titre:       ['', Validators.required],
      description: [''],
      dateDebut:   ['', Validators.required],
      dateFin:     [''],
      contenu:     ['']
    });
  }

  ngOnInit(): void {
    this.membreService.findAll().subscribe(d => this.membres = d);
    this.coachService.findActifs().subscribe(d => this.coachs = d);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  filterByMembre(membreId: number): void {
    if (!membreId) { this.programmes = []; return; }
    this.service.findByMembre(membreId).subscribe(d => this.programmes = d);
  }

  filterByCoach(coachId: number): void {
    if (!coachId) { this.programmes = []; return; }
    this.service.findByCoach(coachId).subscribe(d => this.programmes = d);
  }

  openForm(p?: ProgrammeResponse): void {
    this.showForm = true;
    this.editId = p?.id ?? null;
    p ? this.form.patchValue(p) : this.form.reset();
  }

  cancelForm(): void { this.showForm = false; this.editId = null; }

  save(): void {
    const obs = this.editId
      ? this.service.update(this.editId, this.form.value)
      : this.service.create(this.form.value);
    obs.subscribe({
      next: (p) => {
        this.snackBar.open('Programme sauvegardé', 'OK', { duration: 2000 });
        this.cancelForm();
        if (this.editId) {
          this.programmes = this.programmes.map(x => x.id === p.id ? p : x);
        } else {
          this.programmes = [...this.programmes, p];
        }
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  delete(p: ProgrammeResponse): void {
    if (!confirm(`Supprimer le programme "${p.titre}" ?`)) return;
    this.service.delete(p.id).subscribe({
      next: () => {
        this.snackBar.open('Supprimé', 'OK', { duration: 2000 });
        this.programmes = this.programmes.filter(x => x.id !== p.id);
      }
    });
  }
}