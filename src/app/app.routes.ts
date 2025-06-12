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
  {
    path: 'home-page',
    loadComponent: () => import('./pages/home-page/home-page.page').then( m => m.HomePage)
  },
  {
    path: 'lesson/:classNumber',
    loadComponent: () => import('./pages/classes-list/lesson/lesson-page').then(m => m.LessonPage)
  },
  {
    path: 'lesson/:classNumber/activity/:activityIndex',
    loadComponent: () => import('./pages/activity/activity.page').then(m => m.ActivityPage)
  }

];


