import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaiementService } from '../../core/services/paiement.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, PaiementResponse } from '../../core/models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule,
    MatButtonModule, MatTableModule, RouterLink,
    MatSelectModule, MatFormFieldModule, FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <span class="date-label">{{ today | date:'EEEE dd MMMM yyyy' }}</span>
      </div>

      <!-- STATS CARDS -->
      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card mat-card-custom stat-blue">
          <mat-icon>people</mat-icon>
          <div class="stat-number">{{ stats.membresActifs }}</div>
          <div class="stat-label">Membres actifs</div>
          <div class="stat-sub">{{ stats.totalMembres }} total · {{ stats.membersSuspendus }} suspendus</div>
        </mat-card>

        <mat-card class="stat-card mat-card-custom stat-green">
          <mat-icon>payments</mat-icon>
          <div class="stat-number">{{ stats.revenusMois | number:'1.0-0' }} MAD</div>
          <div class="stat-label">Revenus ce mois</div>
          <div class="stat-sub" [class.alert]="stats.paiementsEnRetard > 0">
            {{ stats.paiementsEnRetard }} paiement(s) en retard
          </div>
        </mat-card>

        <mat-card class="stat-card mat-card-custom stat-orange">
          <mat-icon>event</mat-icon>
          <div class="stat-number">{{ stats.seancesDisponibles }}</div>
          <div class="stat-label">Séances disponibles</div>
          <div class="stat-sub">{{ stats.totalSeances }} total</div>
        </mat-card>

        <mat-card class="stat-card mat-card-custom stat-red"
                  *ngIf="stats.abonnementsExpirantBientot > 0">
          <mat-icon>warning</mat-icon>
          <div class="stat-number">{{ stats.abonnementsExpirantBientot }}</div>
          <div class="stat-label">Expirent bientôt</div>
          <div class="stat-sub">dans 7 jours</div>
        </mat-card>

        <mat-card class="stat-card mat-card-custom stat-purple">
          <mat-icon>sports</mat-icon>
          <div class="stat-number">{{ stats.coachsActifs }}</div>
          <div class="stat-label">Coachs actifs</div>
          <div class="stat-sub">{{ stats.totalCoachs }} total</div>
        </mat-card>

        <mat-card class="stat-card mat-card-custom stat-blue">
          <mat-icon>fitness_center</mat-icon>
          <div class="stat-number">{{ stats.totalEquipements }}</div>
          <div class="stat-label">Équipements</div>
          <div class="stat-sub">{{ stats.equipementsEnMaintenance }} en maintenance</div>
        </mat-card>
      </div>

      <!-- CHARTS -->
      <div class="charts-grid" *ngIf="isAdmin">

        <!-- Revenus par mois -->
        <mat-card class="mat-card-custom chart-card">
          <mat-card-header>
            <mat-card-title>Revenus mensuels (MAD)</mat-card-title>
            <span class="spacer"></span>
            <mat-form-field appearance="outline" style="width:100px">
              <mat-select [(ngModel)]="selectedYear" (ngModelChange)="loadCharts()">
                <mat-option [value]="2024">2024</mat-option>
                <mat-option [value]="2025">2025</mat-option>
                <mat-option [value]="2026">2026</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card-header>
          <mat-card-content>
            <canvas #revenusChart height="120"></canvas>
          </mat-card-content>
        </mat-card>

        <!-- Nouveaux membres par mois -->
        <mat-card class="mat-card-custom chart-card">
          <mat-card-header>
            <mat-card-title>Nouveaux membres par mois</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas #membresChart height="120"></canvas>
          </mat-card-content>
        </mat-card>

        <!-- Répartition statuts membres -->
        <mat-card class="mat-card-custom chart-card">
          <mat-card-header>
            <mat-card-title>Répartition des membres</mat-card-title>
          </mat-card-header>
          <mat-card-content class="donut-container">
            <canvas #statutsChart height="200"></canvas>
          </mat-card-content>
        </mat-card>

      </div>

      <!-- PAIEMENTS EN RETARD -->
      <mat-card class="mat-card-custom" style="margin-top:24px"
                *ngIf="paiementsRetard.length > 0 && isAdmin">
        <mat-card-header>
          <mat-card-title>
            <mat-icon color="warn">warning</mat-icon>
            Paiements en retard ({{ paiementsRetard.length }})
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="paiementsRetard" class="mat-elevation-z1">
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
              <td mat-cell *matCellDef="let p" style="color:red">
                {{ p.dateEcheance | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let p">
                <span class="status-chip expire">{{ p.statut }}</span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['membre','montant','echeance','statut']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['membre','montant','echeance','statut'];"></tr>
          </table>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" routerLink="/paiements">
            Voir tous les paiements →
          </a>
        </mat-card-actions>
      </mat-card>

      <!-- RACCOURCIS -->
      <div class="shortcuts-grid" style="margin-top:24px">
        <mat-card class="shortcut-card mat-card-custom" routerLink="/membres">
          <mat-icon color="primary">person_add</mat-icon>
          <span>Membres</span>
        </mat-card>
        <mat-card class="shortcut-card mat-card-custom" routerLink="/seances">
          <mat-icon color="accent">event</mat-icon>
          <span>Séances</span>
        </mat-card>
        <mat-card class="shortcut-card mat-card-custom" routerLink="/reservations">
          <mat-icon style="color:#4caf50">event_available</mat-icon>
          <span>Réservations</span>
        </mat-card>
        <mat-card class="shortcut-card mat-card-custom" routerLink="/paiements" *ngIf="isAdmin">
          <mat-icon style="color:#ff9800">payments</mat-icon>
          <span>Paiements</span>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .date-label { color: #757575; font-size: 14px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      text-align: center; padding: 20px !important;
      mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 8px; }
      .stat-number { font-size: 36px; font-weight: 700; }
      .stat-label  { font-size: 13px; color: #555; margin: 4px 0; }
      .stat-sub    { font-size: 11px; color: #888; }
      .alert       { color: #e53935 !important; font-weight: 600; }
    }

    .stat-blue   { border-top: 4px solid #3f51b5; mat-icon { color: #3f51b5; } .stat-number { color: #3f51b5; } }
    .stat-green  { border-top: 4px solid #4caf50; mat-icon { color: #4caf50; } .stat-number { color: #4caf50; } }
    .stat-orange { border-top: 4px solid #ff9800; mat-icon { color: #ff9800; } .stat-number { color: #ff9800; } }
    .stat-red    { border-top: 4px solid #f44336; mat-icon { color: #f44336; } .stat-number { color: #f44336; } }
    .stat-purple { border-top: 4px solid #9c27b0; mat-icon { color: #9c27b0; } .stat-number { color: #9c27b0; } }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .chart-card {
      mat-card-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
    }

    .donut-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .spacer { flex: 1; }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .shortcuts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
    }

    .shortcut-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 20px !important; cursor: pointer; gap: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
      span { font-size: 13px; font-weight: 500; color: #444; }
      &:hover { background: #f0f0f0; transform: translateY(-2px); transition: all 0.2s; }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('revenusChart') revenusChartRef!: ElementRef;
  @ViewChild('membresChart') membresChartRef!: ElementRef;
  @ViewChild('statutsChart') statutsChartRef!: ElementRef;

  private auth = inject(AuthService);

  stats: DashboardStats | null = null;
  paiementsRetard: PaiementResponse[] = [];
  today = new Date();
  selectedYear = new Date().getFullYear();

  revenusChart: Chart | null = null;
  membresChart: Chart | null = null;
  statutsChart: Chart | null = null;

  get isAdmin() { return this.auth.currentUser()?.role === 'ADMIN'; }

  constructor(
    private dashboardService: DashboardService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    if (this.isAdmin) {
      forkJoin({
        stats:   this.dashboardService.getStats(),
        retards: this.paiementService.findEnRetard()
      }).subscribe(data => {
        this.stats = data.stats;
        this.paiementsRetard = data.retards;
      });
    } else {
      this.dashboardService.getStats().subscribe(s => this.stats = s);
    }
  }

  ngAfterViewInit(): void {
    if (this.isAdmin) {
      setTimeout(() => this.loadCharts(), 500);
    }
  }

  loadCharts(): void {
    forkJoin({
      revenus:  this.dashboardService.getRevenusParMois(this.selectedYear),
      membres:  this.dashboardService.getNouveauxMembres(this.selectedYear),
      statuts:  this.dashboardService.getStatutsMembres()
    }).subscribe(data => {
      this.buildRevenusChart(data.revenus);
      this.buildMembresChart(data.membres);
      this.buildStatutsChart(data.statuts);
    });
  }

  buildRevenusChart(data: any): void {
    if (this.revenusChart) this.revenusChart.destroy();
    this.revenusChart = new Chart(this.revenusChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Revenus (MAD)',
          data: data.values,
          backgroundColor: 'rgba(63, 81, 181, 0.7)',
          borderColor: '#3f51b5',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  buildMembresChart(data: any): void {
    if (this.membresChart) this.membresChart.destroy();
    this.membresChart = new Chart(this.membresChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Nouveaux membres',
          data: data.values,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4caf50',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  buildStatutsChart(data: any): void {
    if (this.statutsChart) this.statutsChart.destroy();
    this.statutsChart = new Chart(this.statutsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}