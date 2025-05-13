import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonContent,
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
  IonIcon, IonSearchbar, IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.page.html',
  styleUrls: ['./classes-list.page.scss'],
  standalone: true,
  imports: [
    IonButton, IonSearchbar, 
    CommonModule, FormsModule, NgIf, NgFor,
    IonContent, IonHeader, IonButtons, IonTitle, IonToolbar,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonGrid, IonRow, IonCol, IonIcon
  ],
})
export class ClassesListPage implements OnInit {
  searchTerm: string = '';
  classes: any[] = [];
  allClasses: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    addIcons({ search });
  }

  ngOnInit() {
    this.http.get<any>('assets/data/Clases_info.json').subscribe((data) => {
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
}
