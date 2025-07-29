import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonIcon, IonBadge, IonProgressBar, IonText, IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trophy, flash, paw, star, ribbon, medal, create, 
  bulb, time, refresh, lockClosed 
} from 'ionicons/icons';

import { AchievementService, Achievement } from 'src/app/services/achievement.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent,
    IonIcon, IonBadge, IonProgressBar, IonText, IonFooter
  ],
})
export class AchievementsPage implements OnInit {
  currentRoute: string;
  achievements: Achievement[] = [];
  unlockedAchievements: string[] = [];
  totalAchievements: number = 0;
  unlockedCount: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private achievementService: AchievementService
  ) {
    this.currentRoute = this.router.url;
    
    addIcons({
      trophy, flash, paw, star, ribbon, medal, 
      create, time, refresh, lockClosed
    });
  }

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.http.get<any>('assets/data/achievements.json').subscribe((data) => {
      this.achievements = data.achievements;
      this.totalAchievements = this.achievements.length;
      this.unlockedAchievements = this.achievementService.getUnlockedAchievements();
      this.unlockedCount = this.unlockedAchievements.length;

      this.achievements.forEach(achievement => {
        achievement.isUnlocked = this.unlockedAchievements.includes(achievement.id);
        if (achievement.isUnlocked) {
          achievement.unlockedAt = this.achievementService.getAchievementUnlockDate(achievement.id) || undefined;
        }
      });

      this.achievements.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1;
        if (!a.isUnlocked && b.isUnlocked) return 1;
        
        const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4 };
        return (rarityOrder[a.rarity as keyof typeof rarityOrder] || 1) - 
               (rarityOrder[b.rarity as keyof typeof rarityOrder] || 1);
      });
    });
  }

  getRarityColor(rarity: string): string {
    const colors = {
      'common': 'medium',
      'uncommon': 'success', 
      'rare': 'primary',
      'epic': 'warning'
    };
    return colors[rarity as keyof typeof colors] || 'medium';
  }

  getProgressPercentage(): number {
    return this.totalAchievements > 0 ? (this.unlockedCount / this.totalAchievements) * 100 : 0;
  }
}
