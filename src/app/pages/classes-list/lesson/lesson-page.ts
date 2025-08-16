import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { MultipleChoiceComponent } from 'src/app/components/multiple-choice/multiple-choice.component';
import { TypingComponent } from 'src/app/components/typing/typing.component';
import { MatchImageComponent } from 'src/app/components/match-image/match-image.component';
import { MatchPairsComponent } from 'src/app/components/match-pairs/match-pairs.component';
import { AchievementToastComponent } from 'src/app/components/achievement-toast/achievement-toast.component';
import { ProgressService } from 'src/app/services/progress.service';
import { AchievementService, Achievement } from 'src/app/services/achievement.service';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson-page.html',
  styleUrls: ['./lesson-page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    MultipleChoiceComponent,
    TypingComponent,
    MatchImageComponent,
    MatchPairsComponent,
    AchievementToastComponent
  ],
})

export class LessonPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  classNumber: string | null = null;
  lessonData: any;
  activities: { type: string; data: any }[] = [];

  currentIndex: number = 0;
  currentActivity: any;
  currentType: string = '';
  
  hasErrors: boolean = false;
  questionStartTime: number = 0;
  
  newAchievement: Achievement | null = null;
  showAchievementToast: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private progressService: ProgressService,
    private achievementService: AchievementService,
    private cacheService: CacheService,
    private cdr: ChangeDetectorRef
  ) {
    // Suscribirse a nuevos logros
    this.achievementService.newAchievementUnlocked
      .pipe(takeUntil(this.destroy$))
      .subscribe(achievement => {
        if (achievement) {
          this.showNewAchievement(achievement);
        }
      });
  }

  ngOnInit() {
    this.classNumber = this.route.snapshot.paramMap.get('classNumber');

    this.achievementService.startLessonTimer();

    this.cacheService.get<any>('assets/data/Clases_info.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.lessonData = data.classes.find(
          (lesson: any) => lesson.class_number === this.classNumber
        );

        console.log('Lesson Data:', this.lessonData);

        const wordsFile = `assets/data/class${this.classNumber}.json`;
        this.cacheService.get<any>(wordsFile)
          .pipe(takeUntil(this.destroy$))
          .subscribe((activityData) => {
            this.flattenActivities(activityData.activities);
            this.loadCurrentActivity();

            this.cdr.detectChanges();
          });
      });
  }

  flattenActivities(rawActivities: any) {
    this.activities = [];
    for (const type of Object.keys(rawActivities)) {
      for (const item of rawActivities[type]) {
        this.activities.push({ type, data: item });
      }
    }
  }

  loadCurrentActivity() {
    if (this.currentIndex < this.activities.length) {
      const current = this.activities[this.currentIndex];
      this.currentActivity = current.data;
      this.currentType = current.type;
      
      this.questionStartTime = Date.now();
      
      this.checkForCat(current.data);

      this.cdr.detectChanges();
    } else {
      this.currentActivity = null;
      this.currentType = 'done';
      if (this.classNumber) {
        this.progressService.markClassComplete(this.classNumber);
        console.log(`Class ${this.classNumber} marked as complete`);
        
        const completedCount = this.progressService.getCompletedClasses().length;
        this.achievementService.onLessonCompleted(this.classNumber, this.hasErrors, completedCount);
      }
      
      this.cdr.detectChanges();
    }
  }

  handleAnswer(isCorrect: boolean) {
    const responseTime = Date.now() - this.questionStartTime;
    
    this.achievementService.onQuestionAnswered(isCorrect, responseTime, this.currentType);
    
    if (!isCorrect) {
      this.hasErrors = true;
    }

    if (isCorrect) {
      this.currentIndex++;
      this.loadCurrentActivity();
    } else {
    }
  }

  checkForCat(activityData: any) {
    if (activityData.options) {
      const hasCat = activityData.options.some((option: any) => 
        (option.text && option.text.toLowerCase().includes('gato')) ||
        (option.image && option.image.toLowerCase().includes('cat')) ||
        (option.image && option.image.toLowerCase().includes('gato'))
      );
      if (hasCat) {
        this.achievementService.onCatSpotted();
      }
    }
    
    if (activityData.pairs) {
      const hasCat = activityData.pairs.some((pair: any) => 
        (pair.word && pair.word.toLowerCase().includes('gato')) ||
        (pair.image && pair.image.toLowerCase().includes('cat')) ||
        (pair.image && pair.image.toLowerCase().includes('gato'))
      );
      if (hasCat) {
        this.achievementService.onCatSpotted();
      }
    }
  }

  goBack() {
    this.location.back();
  }

  showNewAchievement(achievement: Achievement) {
    this.newAchievement = achievement;
    this.showAchievementToast = true;

    setTimeout(() => {
      this.hideAchievementToast();
    }, 5000);
  }

  hideAchievementToast() {
    this.showAchievementToast = false;
    setTimeout(() => {
      this.newAchievement = null;
    }, 300);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
