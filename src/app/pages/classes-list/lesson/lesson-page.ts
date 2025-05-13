// filepath: /Users/chuyao/Desktop/yim_app/src/app/pages/lesson/lesson.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';

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
  lessonData: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.classNumber = this.route.snapshot.paramMap.get('classNumber');

    this.http.get<any>('assets/data/Clases_info.json').subscribe((data) => {
      this.lessonData = data.classes.find(
        (lesson: any) => lesson.class_number === this.classNumber
      );

      console.log('Lesson Data:', this.lessonData);
    });
  }

  goBack() {
    this.location.back();
  }
}