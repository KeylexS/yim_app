import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, IonRouterOutlet, RouterLink],
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url.split('?')[0]; // Handles query params too
      }
    });
  }

  get showMenu(): boolean {
    return this.currentRoute !== '/welcome-page';
  }
}
