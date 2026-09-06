import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">

      <mat-sidenav #sidenav mode="side" opened class="sidenav">

        <div class="sidenav-header">
          <mat-icon class="header-icon">fitness_center</mat-icon>
          <span class="header-title">GymManager</span>
        </div>

        <mat-nav-list class="nav-list">

          <a mat-list-item routerLink="/dashboard"
             routerLinkActive="active-link"
             class="nav-item">
            <mat-icon matListItemIcon class="nav-icon">dashboard</mat-icon>
            <span matListItemTitle class="nav-text">Dashboard</span>
          </a>

          <ng-container *ngIf="isAdmin() || isCoach()">
            <div class="section-label">GESTION</div>

            <a mat-list-item routerLink="/membres"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">people</mat-icon>
              <span matListItemTitle class="nav-text">Membres</span>
            </a>

            <a mat-list-item routerLink="/seances"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">event</mat-icon>
              <span matListItemTitle class="nav-text">Séances</span>
            </a>

            <a mat-list-item routerLink="/presences"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">how_to_reg</mat-icon>
              <span matListItemTitle class="nav-text">Présences</span>
            </a>

            <a mat-list-item routerLink="/reservations"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">event_available</mat-icon>
              <span matListItemTitle class="nav-text">Réservations</span>
            </a>

            <a mat-list-item routerLink="/programmes"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">assignment</mat-icon>
              <span matListItemTitle class="nav-text">Programmes</span>
            </a>

            <a mat-list-item routerLink="/equipements"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">fitness_center</mat-icon>
              <span matListItemTitle class="nav-text">Équipements</span>
            </a>
          </ng-container>

          <ng-container *ngIf="isAdmin()">
            <div class="section-label">ADMINISTRATION</div>

            <a mat-list-item routerLink="/coachs"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">sports</mat-icon>
              <span matListItemTitle class="nav-text">Coachs</span>
            </a>

            <a mat-list-item routerLink="/plans"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">card_membership</mat-icon>
              <span matListItemTitle class="nav-text">Plans</span>
            </a>

            <a mat-list-item routerLink="/abonnements"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">subscriptions</mat-icon>
              <span matListItemTitle class="nav-text">Abonnements</span>
            </a>

            <a mat-list-item routerLink="/paiements"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">payments</mat-icon>
              <span matListItemTitle class="nav-text">Paiements</span>
            </a>

            
          </ng-container>

          <ng-container *ngIf="isMembre()">
            <div class="section-label">MON ESPACE</div>

            <a mat-list-item routerLink="/membres"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">person</mat-icon>
              <span matListItemTitle class="nav-text">Mon profil</span>
            </a>

            <a mat-list-item routerLink="/seances"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">event</mat-icon>
              <span matListItemTitle class="nav-text">Séances</span>
            </a>

            <a mat-list-item routerLink="/reservations"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">event_available</mat-icon>
              <span matListItemTitle class="nav-text">Mes réservations</span>
            </a>

            <a mat-list-item routerLink="/programmes"
               routerLinkActive="active-link" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">assignment</mat-icon>
              <span matListItemTitle class="nav-text">Mon programme</span>
            </a>
          </ng-container>

        </mat-nav-list>

        <div class="sidenav-footer">GymManager v1.0</div>

      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-spacer"></span>

          <span class="role-badge" [ngClass]="user()?.role?.toLowerCase()">
            {{ user()?.role }}
          </span>

          <span class="user-name">{{ user()?.prenom }} {{ user()?.nom }}</span>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="user-menu-header">
              <div class="user-menu-name">{{ user()?.prenom }} {{ user()?.nom }}</div>
              <div class="user-menu-email">{{ user()?.email }}</div>
              <div class="user-menu-role">{{ user()?.role }}</div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }

    /* ── Sidebar background ── */
    .sidenav {
      width: 250px;
      background: #1a237e;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      background: rgba(0, 0, 0, 0.25);
      flex-shrink: 0;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ffffff !important;
    }

    .header-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff !important;
      letter-spacing: 0.5px;
    }

    /* ── Section label ── */
    .section-label {
      font-size: 10px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.55) !important;
      letter-spacing: 1.5px;
      padding: 12px 16px 4px;
      margin: 0;
    }

    /* ── Nav list container ── */
    .nav-list {
      flex: 1;
      padding-top: 8px;
    }

    /* ── Nav item — base ── */
    .nav-item {
      border-radius: 8px !important;
      margin: 2px 8px !important;
      height: 44px !important;
    }

    /* ── Nav text — toujours blanc ── */
    .nav-text {
      color: rgba(255, 255, 255, 0.88) !important;
      font-size: 14px;
    }

    /* ── Nav icon — toujours blanc ── */
    .nav-icon {
      color: rgba(255, 255, 255, 0.88) !important;
    }

    /* ── Forcer couleur sur les classes Material internes ── */
    .nav-item .mdc-list-item__primary-text {
      color: rgba(255, 255, 255, 0.88) !important;
    }

    /* ── Hover ── */
    .nav-item:hover .mdc-list-item__primary-text,
    .nav-item:hover .nav-text {
      color: #ffffff !important;
    }

    .nav-item:hover .nav-icon {
      color: #ffffff !important;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    /* ── Active link ── */
    .nav-item.active-link {
      background: rgba(255, 255, 255, 0.2) !important;
    }

    .nav-item.active-link .mdc-list-item__primary-text,
    .nav-item.active-link .nav-text {
      color: #ffffff !important;
      font-weight: 600;
    }

    .nav-item.active-link .nav-icon {
      color: #ffffff !important;
    }

    /* ── Footer ── */
    .sidenav-footer {
      padding: 12px 16px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.35) !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    /* ── Toolbar ── */
    .toolbar {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toolbar-spacer { flex: 1; }

    .user-name {
      margin-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: white;
    }

    /* ── Role badge ── */
    .role-badge {
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-right: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.admin  { background: #ff9800; color: white; }
    .role-badge.coach  { background: #4caf50; color: white; }
    .role-badge.membre { background: #2196f3; color: white; }

    /* ── User menu ── */
    .user-menu-header {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      min-width: 200px;
    }

    .user-menu-name  { font-weight: 600; font-size: 14px; color: #333; }
    .user-menu-email { font-size: 12px; color: #888; margin-top: 2px; }
    .user-menu-role  { font-size: 11px; font-weight: 700; color: #3f51b5;
                       margin-top: 4px; text-transform: uppercase; }

    /* ── Content area ── */
    .content {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  isAdmin()  { return this.user()?.role === 'ADMIN';  }
  isCoach()  { return this.user()?.role === 'COACH';  }
  isMembre() { return this.user()?.role === 'MEMBRE'; }

  logout() { this.authService.logout(); }
}