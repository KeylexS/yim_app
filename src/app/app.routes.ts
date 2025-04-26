import { Routes } from '@angular/router';

// Define las rutas de la aplicación
// Se utiliza loadComponent para cargar los componentes
// de forma diferida (lazy loading) para mejorar el rendimiento
// y reducir el tamaño del bundle inicial

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome-page',
    pathMatch: 'full'
  },
  {
    path: 'welcome-page',
    loadComponent: () => import('./pages/welcome-page/welcome-page.page').then( m => m.WelcomePage )
  },
  {
    path: 'classes-list',
    loadComponent: () => import('./pages/classes-list/classes-list.page').then( m => m.ClassesListPage)
  },
  {
    path: 'completed-classes',
    loadComponent: () => import('./pages/completed-classes/completed-classes.page').then( m => m.CompletedClassesPage)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./pages/achievements/achievements.page').then( m => m.AchievementsPage)
  },
];


