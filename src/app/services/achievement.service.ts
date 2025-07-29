import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  unlockedAt?: Date;
  isUnlocked?: boolean;
}

export interface AchievementProgress {
  perfectLessonsStreak: number;
  typingPerfectStreak: number;
  memoryPerfectStreak: number;
  consecutiveErrors: number;
  lessonStartTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private storageKey = 'achievements';
  private progressKey = 'achievementProgress';
  
  // Subject para notificar cuando se desbloquea un logro
  public newAchievementUnlocked = new BehaviorSubject<Achievement | null>(null);

  constructor() {}

  // Obtener todos los logros desbloqueados
  getUnlockedAchievements(): string[] {
    const unlocked = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return unlocked;
  }

  // Verificar si un logro está desbloqueado
  isAchievementUnlocked(achievementId: string): boolean {
    return this.getUnlockedAchievements().includes(achievementId);
  }

  // Desbloquear un logro
  unlockAchievement(achievementId: string, achievementData?: Achievement) {
    const unlocked = this.getUnlockedAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      localStorage.setItem(this.storageKey, JSON.stringify(unlocked));
      
      // Guardar fecha de desbloqueo
      const achievementDates = JSON.parse(localStorage.getItem(this.storageKey + '_dates') || '{}');
      achievementDates[achievementId] = new Date().toISOString();
      localStorage.setItem(this.storageKey + '_dates', JSON.stringify(achievementDates));

      console.log('Achievement unlocked:', achievementId);
      
      // Notificar que se desbloqueó un logro
      if (achievementData) {
        this.newAchievementUnlocked.next(achievementData);
      }
      
      return true;
    }
    return false;
  }

  // Obtener progreso actual
  getProgress(): AchievementProgress {
    return JSON.parse(localStorage.getItem(this.progressKey) || '{"perfectLessonsStreak": 0, "typingPerfectStreak": 0, "memoryPerfectStreak": 0, "consecutiveErrors": 0}');
  }

  // Actualizar progreso
  updateProgress(progress: Partial<AchievementProgress>) {
    const currentProgress = this.getProgress();
    const newProgress = { ...currentProgress, ...progress };
    localStorage.setItem(this.progressKey, JSON.stringify(newProgress));
  }

  // Iniciar seguimiento de tiempo de lección
  startLessonTimer() {
    this.updateProgress({ lessonStartTime: Date.now() });
  }

  // Eventos específicos para verificar logros
  
  // Cuando se completa una lección
  onLessonCompleted(classNumber: string, hadErrors: boolean, completedClassesCount: number) {
    const progress = this.getProgress();
    
    // Primera lección
    if (completedClassesCount === 1) {
      this.unlockAchievement('first_lesson');
    }
    
    // 5 lecciones
    if (completedClassesCount === 5) {
      this.unlockAchievement('five_lessons');
    }
    
    // 10 lecciones
    if (completedClassesCount === 10) {
      this.unlockAchievement('ten_lessons');
    }

    // Sin fallas
    if (!hadErrors) {
      const newStreak = progress.perfectLessonsStreak + 1;
      this.updateProgress({ perfectLessonsStreak: newStreak });
      this.unlockAchievement('perfect_lesson');
    } else {
      this.updateProgress({ perfectLessonsStreak: 0 });
    }

    // Velocista (menos de 2 minutos)
    if (progress.lessonStartTime) {
      const duration = Date.now() - progress.lessonStartTime;
      if (duration < 120000) { // 2 minutos
        this.unlockAchievement('speed_demon');
      }
    }

    // Rey del regreso (completa después de 3 errores consecutivos)
    if (progress.consecutiveErrors >= 3) {
      this.unlockAchievement('comeback_king');
    }

    // Reset errores consecutivos al completar
    this.updateProgress({ consecutiveErrors: 0 });
  }

  // Cuando se responde una pregunta
  onQuestionAnswered(isCorrect: boolean, responseTime: number, activityType: string) {
    const progress = this.getProgress();

    if (isCorrect) {
      // Aprendiz rápido (menos de 3 segundos)
      if (responseTime < 3000) {
        this.unlockAchievement('quick_learner');
      }

      // Tracking para actividades específicas
      if (activityType === 'typing') {
        const newStreak = progress.typingPerfectStreak + 1;
        this.updateProgress({ typingPerfectStreak: newStreak });
        
        if (newStreak >= 5) {
          this.unlockAchievement('typing_master');
        }
      } else if (activityType === 'match_pairs' || activityType === 'match_image') {
        const newStreak = progress.memoryPerfectStreak + 1;
        this.updateProgress({ memoryPerfectStreak: newStreak });
        
        if (newStreak >= 3) {
          this.unlockAchievement('memory_expert');
        }
      }

      // Reset errores consecutivos
      this.updateProgress({ consecutiveErrors: 0 });
    } else {
      // Incrementar errores consecutivos
      const newErrors = progress.consecutiveErrors + 1;
      this.updateProgress({ consecutiveErrors: newErrors });

      // Reset streaks perfectos
      if (activityType === 'typing') {
        this.updateProgress({ typingPerfectStreak: 0 });
      } else if (activityType === 'match_pairs' || activityType === 'match_image') {
        this.updateProgress({ memoryPerfectStreak: 0 });
      }
    }
  }

  // Cuando se encuentra un gato (para logro especial)
  onCatSpotted() {
    this.unlockAchievement('cat_spotter');
  }

  // Reset todos los logros
  resetAchievements() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey + '_dates');
    localStorage.removeItem(this.progressKey);
  }

  // Obtener fecha de desbloqueo
  getAchievementUnlockDate(achievementId: string): Date | null {
    const dates = JSON.parse(localStorage.getItem(this.storageKey + '_dates') || '{}');
    return dates[achievementId] ? new Date(dates[achievementId]) : null;
  }
}
