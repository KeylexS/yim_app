// filepath: src/app/components/match-image/match-image.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-match-image',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './match-image.component.html',
  styleUrls: ['./match-image.component.scss']
})
export class MatchImageComponent {
  @Input() data: any;
  @Output() answered = new EventEmitter<boolean>();

  selectedOption: string | null = null;
  feedbackState: { [key: string]: 'correct' | 'wrong' } = {};

  selectOption(option: string) {
    if (this.selectedOption) return;

    this.selectedOption = option;
    const isCorrect = option === this.data.answer;
    this.feedbackState[option] = isCorrect ? 'correct' : 'wrong';

    setTimeout(() => {
      this.answered.emit(isCorrect);
    }, 800);
  }

  getClass(option: string): string {
    return this.feedbackState[option] || '';
  }
}
