// filepath: src/app/components/typing/typing.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss']
})
export class TypingComponent {
  @Input() data: any;
  @Output() answered = new EventEmitter<boolean>();

  userAnswer: string = '';
  isCorrect: boolean | null = null;

  checkAnswer() {
    const correct = this.userAnswer.trim().toLowerCase() === this.data.answer.trim().toLowerCase();
    this.isCorrect = correct;

    setTimeout(() => {
      this.answered.emit(correct);
    }, 800); // short delay for feedback
  }
}
