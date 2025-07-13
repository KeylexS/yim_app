import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonSearchbar
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
    CommonModule, FormsModule, NgIf, NgFor,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonButton, IonSearchbar
  ],
})

// CompletedClassesPage to display completed classes
export class CompletedClassesPage implements OnInit {
  completedClasses: ClassInfo[] = [];
  allCompletedClasses: ClassInfo[] = [];
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private progressService: ProgressService
  ) {}

  // Initialize the component and load completed classes
  ngOnInit() {
    this.http.get<{ classes: ClassInfo[] }>('assets/data/Clases_info.json')
      .subscribe((data) => {
        const completed = this.progressService.getCompletedClasses();
        console.log('All classes:', data.classes);
        console.log('Completed class numbers:', completed);
        this.allCompletedClasses = data.classes.filter((c: ClassInfo) =>
          completed.includes(c.class_number)
        );
        this.completedClasses = [...this.allCompletedClasses];
        console.log('Filtered completed classes:', this.completedClasses);
      });
  }

  // Search function to filter completed classes
  searchFunction() {
    const term = this.searchTerm.toLowerCase();
    this.completedClasses = this.allCompletedClasses.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.class_number.toString().includes(term)
    );
  }

  // Navigate to the lesson page for the selected class
  openClass(classNumber: string) {
    this.router.navigate(['/lesson', classNumber]);
  }
}
