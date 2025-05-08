import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  IonIcon, IonSearchbar, IonButton } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
  import { search } from 'ionicons/icons';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.page.html',
  styleUrls: ['./classes-list.page.scss'],
  standalone: true,
  imports: [IonButton, IonSearchbar, 
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
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
    IonIcon,
  ],
})
export class ClassesListPage implements OnInit {
  classes: any[] = [];

  constructor(private http: HttpClient) {
    addIcons({ search });
  }

  ngOnInit() {
    this.http.get<any>('assets/data/Clases_info.json').subscribe((data) => {
      this.classes = data.classes;
    });
  }

  searchFunction() {
    console.log('Search button clicked!');
    // Add the logic for your search functionality here
  }
}
