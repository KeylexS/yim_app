// filepath: src/app/components/typing/typing.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss']
})
export class TypingComponent {
  @Input() data: { question: string; word: string; answer: string } | any;
  @Output() answered = new EventEmitter<boolean>();

  userAnswer = '';
  isCorrect: boolean | null = null;

  updateAnswer(event: any) {
    this.userAnswer = event.target.value;
  }

  checkAnswer() {
    const correct =
      this.userAnswer.trim().toLowerCase() ===
      this.data.answer.trim().toLowerCase();

    this.isCorrect = correct;

    setTimeout(() => {
      this.answered.emit(correct);
      this.userAnswer = ''; // reset input after checking
    }, 800);
  }
}
