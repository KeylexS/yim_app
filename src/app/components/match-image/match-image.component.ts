// filepath: src/app/components/match-image/match-image.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-match-image',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './match-image.component.html',
  styleUrls: ['./match-image.component.scss']
})
export class MatchImageComponent implements OnChanges {
  @Input() data: any;
  @Output() answered = new EventEmitter<boolean>();

  selectedOption: string | null = null;
  feedbackState: { [key: string]: 'correct' | 'wrong' | undefined } = {};
  locked: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.selectedOption = null;
      this.feedbackState = {};
      this.locked = false;
    }
  }

  selectOption(option: string) {
    if (this.locked) return;

    this.selectedOption = option;
    const isCorrect = option === this.data.answer;
    this.feedbackState[option] = isCorrect ? 'correct' : 'wrong';

    if (isCorrect) {
      this.locked = true;
      setTimeout(() => {
        this.answered.emit(true);
      }, 800);
    } else {
      this.locked = true;
      setTimeout(() => {
        this.feedbackState[option] = undefined;
        this.selectedOption = null;
        this.locked = false;
      }, 800);
    }
  }

  getClass(option: string): string {
    return this.feedbackState[option] || '';
  }
}
