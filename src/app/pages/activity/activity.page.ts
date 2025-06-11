import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

// Import all activity components
import { MultipleChoiceComponent } from 'src/app/components/multiple-choice/multiple-choice.component';
import { TypingComponent } from 'src/app/components/typing/typing.component';
import { MatchImageComponent } from 'src/app/components/match-image/match-image.component';
import { MatchPairsComponent } from 'src/app/components/match-pairs/match-pairs.component';

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
export class ActivityPage implements OnInit {
  classNumber!: string;
  activityIndex!: number;

  activity: any;
  activityType: string = '';
  totalActivities: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.classNumber = this.route.snapshot.paramMap.get('classNumber')!;
    this.activityIndex = Number(this.route.snapshot.paramMap.get('activityIndex'));

    const path = `assets/data/class${this.classNumber}_words.json`;
    this.http.get<any>(path).subscribe((data) => {
      const flat = this.flattenActivities(data.activities);
      this.totalActivities = flat.length;

      if (this.activityIndex < flat.length) {
        this.activity = flat[this.activityIndex].data;
        this.activityType = flat[this.activityIndex].type;
      } else {
        this.router.navigate([`/lesson/${this.classNumber}`]); // Go back when done
      }
    });
  }

  flattenActivities(activities: any): { type: string; data: any }[] {
    const result: { type: string; data: any }[] = [];
    for (let type in activities) {
      for (let item of activities[type]) {
        result.push({ type, data: item });
      }
    }
    return result;
  }

  onAnswered(correct: boolean) {
    if (correct) {
      const nextIndex = this.activityIndex + 1;
      this.router.navigate([`/lesson/${this.classNumber}/activity/${nextIndex}`]);
    }
  }
}
