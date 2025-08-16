import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CacheService } from 'src/app/services/cache.service';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonButton, IonSearchbar, IonFooter
} from '@ionic/angular/standalone';

import { ProgressService } from 'src/app/services/progress.service';

interface ClassInfo {
  class_number: string;
  name: string;
  description: string;
  category: string;
  image: string;
  active: boolean;
}

@Component({
  selector: 'app-completed-classes',
  templateUrl: './completed-classes.page.html',
  styleUrls: ['./completed-classes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, NgIf, NgFor, RouterModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonButton, IonSearchbar, IonFooter
  ],
})
export class CompletedClassesPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  completedClasses: ClassInfo[] = [];
  allCompletedClasses: ClassInfo[] = [];
  searchTerm: string = '';
  currentRoute: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private progressService: ProgressService,
    private cacheService: CacheService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit() {
    this.cacheService.get<{ classes: ClassInfo[] }>('assets/data/Clases_info.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const completedClassNumbers = this.progressService.getCompletedClasses();
        this.allCompletedClasses = data.classes.filter(c =>
          completedClassNumbers.includes(c.class_number)
        );
        this.completedClasses = [...this.allCompletedClasses];

        this.cdr.detectChanges();
      });
  }

  searchFunction() {
    const term = this.searchTerm.toLowerCase();
    this.completedClasses = this.allCompletedClasses.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.class_number.toString().includes(term)
    );
  }

  openClass(classNumber: string) {
    this.router.navigate(['/lesson', classNumber]);
  }

  trackByClassNumber(index: number, classItem: ClassInfo): string {
    return classItem.class_number;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
