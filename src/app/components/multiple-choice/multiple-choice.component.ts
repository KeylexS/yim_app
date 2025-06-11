// src/app/components/multiple-choice/multiple-choice.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent {
  @Input() data: any;
  @Output() answered = new EventEmitter<boolean>();

  selectedOption: string | null = null;
  feedbackState: { [key: string]: 'correct' | 'wrong' | undefined } = {};
  locked: boolean = false;

  selectOption(option: string) {
    if (this.locked) return;

    const isCorrect = option === this.data.answer;
    this.feedbackState[option] = isCorrect ? 'correct' : 'wrong';
    this.selectedOption = option;

    if (isCorrect) {
      this.locked = true;
      setTimeout(() => {
        this.answered.emit(true);
      }, 600);
    } else {
      this.locked = true;
      setTimeout(() => {
        this.feedbackState[option] = undefined;
        this.selectedOption = null;
        this.locked = false;
      }, 800);
    }
  }

  getClass(option: string): string | undefined {
    return this.feedbackState[option]; // 'correct', 'wrong', or undefined
  }
}
