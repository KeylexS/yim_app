import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';

// ✅ Import activity components (adjust paths if needed)
import { MultipleChoiceComponent } from 'src/app/components/multiple-choice/multiple-choice.component';
import { TypingComponent } from 'src/app/components/typing/typing.component';
import { MatchImageComponent } from 'src/app/components/match-image/match-image.component';
import { MatchPairsComponent } from 'src/app/components/match-pairs/match-pairs.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson-page.html',
  styleUrls: ['./lesson-page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,

    // ✅ Register components used in the HTML template
    MultipleChoiceComponent,
    TypingComponent,
    MatchImageComponent,
    MatchPairsComponent
  ],
})
export class LessonPage implements OnInit {
  classNumber: string | null = null;
  lessonData: any;
  activities: { type: string; data: any }[] = [];

  currentIndex: number = 0;
  currentActivity: any;
  currentType: string = '';

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

      const wordsFile = `assets/data/class${this.classNumber}.json`;
      this.http.get<any>(wordsFile).subscribe((activityData) => {
        this.flattenActivities(activityData.activities);
        this.loadCurrentActivity();
      });
    });
  }

  flattenActivities(rawActivities: any) {
    this.activities = []; // Clear before flattening again (important!)
    for (const type of Object.keys(rawActivities)) {
      for (const item of rawActivities[type]) {
        this.activities.push({ type, data: item });
      }
    }
  }

  loadCurrentActivity() {
    if (this.currentIndex < this.activities.length) {
      const current = this.activities[this.currentIndex];
      this.currentActivity = current.data;
      this.currentType = current.type;
    } else {
      this.currentActivity = null;
      this.currentType = 'done';
    }
  }

  handleAnswer(isCorrect: boolean) {
    if (isCorrect) {
      this.currentIndex++;
      this.loadCurrentActivity();
    } else {
      // You can show visual feedback inside the component itself
    }
  }

  goBack() {
    this.location.back();
  }
}
