import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonHeader,
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
  IonIcon // <-- Add this
} from '@ionic/angular/standalone';



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
    IonContent,
    IonHeader,
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
    IonIcon // <-- Add this here too
  ]
  
})
export class ClassesListPage implements OnInit {
  classes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('assets/data/Clases_info.json').subscribe(data => {
      this.classes = data.classes; // ✅ because your JSON has a "classes" key
    });
  }
}
