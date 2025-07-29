import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';

import { MultipleChoiceComponent } from 'src/app/components/multiple-choice/multiple-choice.component';
import { TypingComponent } from 'src/app/components/typing/typing.component';
import { MatchImageComponent } from 'src/app/components/match-image/match-image.component';
import { MatchPairsComponent } from 'src/app/components/match-pairs/match-pairs.component';
import { AchievementToastComponent } from 'src/app/components/achievement-toast/achievement-toast.component';
import { ProgressService } from 'src/app/services/progress.service';
import { AchievementService, Achievement } from 'src/app/services/achievement.service';

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

// LessonPage to handle the lesson and its activities
export class LessonPage implements OnInit {
  classNumber: string | null = null;
  lessonData: any;
  activities: { type: string; data: any }[] = [];

  currentIndex: number = 0;
  currentActivity: any;
  currentType: string = '';
  
  // Tracking para logros
  hasErrors: boolean = false;
  questionStartTime: number = 0;
  
  // Para el toast de logros
  newAchievement: Achievement | null = null;
  showAchievementToast: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private progressService: ProgressService,
    private achievementService: AchievementService
  ) {
    // Suscribirse a nuevos logros
    this.achievementService.newAchievementUnlocked.subscribe(achievement => {
      if (achievement) {
        this.showNewAchievement(achievement);
      }
    });
  }

  // Initialize the component and load the lesson data
  ngOnInit() {
    this.classNumber = this.route.snapshot.paramMap.get('classNumber');

    // Iniciar timer para el logro de velocista
    this.achievementService.startLessonTimer();

    this.http.get<any>('assets/data/Clases_info.json').subscribe((data) => {
      this.lessonData = data.classes.find(
        (lesson: any) => lesson.class_number === this.classNumber
      );

      console.log('Lesson Data:', this.lessonData);

      const wordsFile = `assets/data/class${this.classNumber}.json`;
      this.http.get<any>(wordsFile).subscribe((activityData) => {
        this.flattenActivities(activityData.activities);
        this.loadCurrentActivity();
      });
    });
  }

  // Flatten the activities from the lesson data
  flattenActivities(rawActivities: any) {
    this.activities = []; // Clear before flattening again (important!)
    for (const type of Object.keys(rawActivities)) {
      for (const item of rawActivities[type]) {
        this.activities.push({ type, data: item });
      }
    }
  }

  // Load the current activity based on the index
  loadCurrentActivity() {
    if (this.currentIndex < this.activities.length) {
      const current = this.activities[this.currentIndex];
      this.currentActivity = current.data;
      this.currentType = current.type;
      
      // Iniciar timer para la pregunta
      this.questionStartTime = Date.now();
      
      // Verificar si hay un gato en las opciones (para el logro especial)
      this.checkForCat(current.data);
    } else {
      this.currentActivity = null;
      this.currentType = 'done';
      // Mark class as complete when all activities are finished
      if (this.classNumber) {
        this.progressService.markClassComplete(this.classNumber);
        console.log(`Class ${this.classNumber} marked as complete`);
        
        // Trigger achievement checking
        const completedCount = this.progressService.getCompletedClasses().length;
        this.achievementService.onLessonCompleted(this.classNumber, this.hasErrors, completedCount);
      }
    }
  }

  // Handle the completion of an activity
  handleAnswer(isCorrect: boolean) {
    const responseTime = Date.now() - this.questionStartTime;
    
    // Track para logros
    this.achievementService.onQuestionAnswered(isCorrect, responseTime, this.currentType);
    
    if (!isCorrect) {
      this.hasErrors = true;
    }

    if (isCorrect) {
      this.currentIndex++;
      this.loadCurrentActivity();
    } else {
      // You can show visual feedback inside the component itself
    }
  }

  // Verificar si hay un gato en las opciones (logro especial)
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

  // Navigate back to the previous page
  goBack() {
    this.location.back();
  }

  // Mostrar notificación de nuevo logro
  showNewAchievement(achievement: Achievement) {
    this.newAchievement = achievement;
    this.showAchievementToast = true;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.hideAchievementToast();
    }, 5000);
  }

  // Ocultar notificación de logro
  hideAchievementToast() {
    this.showAchievementToast = false;
    setTimeout(() => {
      this.newAchievement = null;
    }, 300);
  }
}
