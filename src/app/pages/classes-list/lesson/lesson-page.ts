// filepath: /Users/chuyao/Desktop/yim_app/src/app/pages/lesson/lesson.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson-page.html',
  styleUrls: ['./lesson-page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule,  
  ],
})
export class LessonPage implements OnInit {
  classNumber: string | null = null;
  className: string | null = null;
  lessonData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Agarrar el classNumber de la URL
    this.classNumber = this.route.snapshot.paramMap.get('classNumber');

    // Cargar los datos de la lección
    this.http.get<any>('../../../assets/data/Clases_info.json').subscribe((data) => {
      // Encontrar la lección correspondiente al classNumber
      this.lessonData = data.classes.find(
        (lesson: any) => lesson.class_number === this.classNumber
      );

      console.log('Lesson Data:', this.lessonData); // Verificar los datos de la lección
    });
  }
}