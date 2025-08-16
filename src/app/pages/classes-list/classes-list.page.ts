import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CacheService } from 'src/app/services/cache.service';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSearchbar,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.page.html',
  styleUrls: ['./classes-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    RouterModule,
    IonButton,
    IonSearchbar,
    IonContent,
    IonFooter,
    IonHeader,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClassesListPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchTerm: string = '';
  classes: any[] = [];
  allClasses: any[] = [];
  currentRoute: string;

  constructor(private http: HttpClient, private router: Router, private cacheService: CacheService, private cdr: ChangeDetectorRef) {
    addIcons({ search });
    this.currentRoute = this.router.url;
  }

  ngOnInit() {
    this.cacheService.get<any>('assets/data/Clases_info.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.allClasses = data.classes;
        this.classes = [...this.allClasses];
      });
  }

  searchFunction() {
    const term = this.searchTerm.toLowerCase();
    this.classes = this.allClasses.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.class_number.toString().includes(term)
    );
  }

  openClass(classNumber: number) {
    this.router.navigate(['/lesson', classNumber]);
  }
  
  trackByClassNumber(index: number, classItem: any): string {
    return classItem.class_number;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
