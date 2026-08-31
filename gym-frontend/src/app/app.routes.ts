import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'membres',
        loadComponent: () => import('./features/membres/membres-list/membres-list.component').then(c => c.MembresListComponent)
      },
      {
        path: 'coachs',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/coachs/coachs-list/coachs-list.component').then(c => c.CoachsListComponent)
      },
      {
        path: 'plans',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/plans/plans-list/plans-list.component').then(c => c.PlansListComponent)
      },
      {
        path: 'abonnements',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/abonnements/abonnements-list/abonnements-list.component').then(c => c.AbonnementsListComponent)
      },
      {
        path: 'seances',
        loadComponent: () => import('./features/seances/seances-list/seances-list.component').then(c => c.SeancesListComponent)
      },
      {
        path: 'equipements',
        loadComponent: () => import('./features/equipements/equipements-list/equipements-list.component').then(c => c.EquipementsListComponent)
      },
      {
        path: 'paiements',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/paiements/paiements-list/paiements-list.component').then(c => c.PaiementsListComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/reservations-list/reservations-list.component').then(c => c.ReservationsListComponent)
      },
      {
        path: 'presences',
        loadComponent: () => import('./features/presences/presences-list/presences-list.component').then(c => c.PresencesListComponent)
      },
      {
        path: 'programmes',
        loadComponent: () => import('./features/programmes/programmes-list/programmes-list.component').then(c => c.ProgrammesListComponent)
      },
      {
        path: 'admin/create-user',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/create-user/create-user.component').then(c => c.CreateUserComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];