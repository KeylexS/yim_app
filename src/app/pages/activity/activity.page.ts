import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { MultipleChoiceComponent } from 'src/app/components/multiple-choice/multiple-choice.component';
import { TypingComponent } from 'src/app/components/typing/typing.component';
import { MatchImageComponent } from 'src/app/components/match-image/match-image.component';
import { MatchPairsComponent } from 'src/app/components/match-pairs/match-pairs.component';
import { ProgressService } from 'src/app/services/progress.service';
@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    MultipleChoiceComponent,
    TypingComponent,
    MatchImageComponent,
    MatchPairsComponent
  ],
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss']
})

// ActivityPage to handle individual activities within a lesson
export class ActivityPage implements OnInit {
  classNumber!: string;
  activityIndex!: number;

  activity: any;
  activityType: string = '';
  totalActivities: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private progressService: ProgressService
  ) {}
  
  // Initialize the component and load the activity data
  ngOnInit() {
    this.classNumber = this.route.snapshot.paramMap.get('classNumber')!;
    this.activityIndex = Number(this.route.snapshot.paramMap.get('activityIndex'));

    const path = `assets/data/class${this.classNumber}.json`;
    this.http.get<any>(path).subscribe((data) => {
      const flat = this.flattenActivities(data.activities);
      this.totalActivities = flat.length;

      if (this.activityIndex < flat.length) {
        this.activity = flat[this.activityIndex].data;
        this.activityType = flat[this.activityIndex].type;
      } else {
        this.progressService.markClassComplete(this.classNumber.toString());
        this.router.navigate([`/lesson/${this.classNumber}`]);
      }
    });
  }
  
  // Load the current activity based on the index
  flattenActivities(activities: any): { type: string; data: any }[] {
    const result: { type: string; data: any }[] = [];
    for (let type in activities) {
      for (let item of activities[type]) {
        result.push({ type, data: item });
      }
    }
    return result;
  }
  
  // Handle the completion of an activity
  onAnswered(correct: boolean) {
    if (correct) {
      const nextIndex = this.activityIndex + 1;

      if (nextIndex >= this.totalActivities) {
        this.progressService.markClassComplete(this.classNumber.toString());
      }

      this.router.navigate([`/lesson/${this.classNumber}/activity/${nextIndex}`]);
    }
  }
}