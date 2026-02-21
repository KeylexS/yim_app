import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trophy, flash, paw, star, ribbon, medal, lockClosed,
  create, bulb, time, refresh
} from 'ionicons/icons';

import { AchievementService, Achievement } from 'src/app/services/achievement.service';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonFooter
  ],
})
export class AchievementsPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentRoute: string;
  achievements: Achievement[] = [];
  unlockedAchievements: string[] = [];
  totalAchievements: number = 0;
  unlockedCount: number = 0;

  constructor(
    private router: Router,
    private achievementService: AchievementService,
    private cacheService: CacheService
  ) {
    this.currentRoute = this.router.url;
    
    addIcons({ trophy, flash, paw, star, ribbon, medal, lockClosed, create, bulb, time, refresh });
  }

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.cacheService.get<any>('assets/data/achievements.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
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

        // Sort unlocked first
        this.achievements.sort((a, b) => {
          if (a.isUnlocked && !b.isUnlocked) return -1;
          if (!a.isUnlocked && b.isUnlocked) return 1;
          return 0;
        });
      });
  }

  getIcon(achievement: Achievement): string {
    return achievement.icon || 'star';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
