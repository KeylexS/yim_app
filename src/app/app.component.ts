import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, IonRouterOutlet, RouterLink],
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event.urlAfterRedirects.split('?')[0];
      });
  }

  get showMenu(): boolean {
    return this.currentRoute !== '/welcome-page';
  }
}

