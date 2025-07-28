import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonFooter,
  IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonFooter, IonGrid, IonRow, IonCol
  ],
})
export class AchievementsPage implements OnInit {
  currentRoute: string;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }

  ngOnInit() {}
}
