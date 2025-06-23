import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface MatchPair {
  word: string;
  image: string;
}

@Component({
  selector: 'app-match-pairs',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './match-pairs.component.html',
  styleUrls: ['./match-pairs.component.scss']
})
export class MatchPairsComponent {
  @Input() data!: { pairs: MatchPair[] };
  @Output() completed = new EventEmitter<boolean>();

  selectedWord: string | null = null;
  matched: { [key: string]: string } = {};
  completedPairs: Set<string> = new Set();

  correctMatches: Set<string> = new Set();
  incorrectWord: string | null = null;

  selectWord(word: string) {
    this.selectedWord = word;
    this.incorrectWord = null;
  }

  selectImage(image: string) {
    if (!this.selectedWord) return;

    const correctImage = this.data.pairs.find((p: MatchPair) => p.word === this.selectedWord)?.image;

    if (image === correctImage) {
      this.matched[this.selectedWord] = image;
      this.correctMatches.add(this.selectedWord);
      this.completedPairs.add(this.selectedWord);
      this.selectedWord = null;
      this.incorrectWord = null;

      if (this.completedPairs.size === this.data.pairs.length) {
        setTimeout(() => this.completed.emit(true), 500);
      }
    } else {
      this.incorrectWord = this.selectedWord;
      setTimeout(() => {
        this.incorrectWord = null;
        this.selectedWord = null;
      }, 1000);
    }
  }

  getWordColor(word: string): string {
    if (this.correctMatches.has(word)) return 'success';
    if (this.incorrectWord === word) return 'danger';
    if (this.selectedWord === word) return 'primary';
    return '';
  }

  getImageColor(word: string): string {
    if (this.correctMatches.has(word)) return 'success';
    if (this.incorrectWord === word) return 'danger';
    return '';
  }
}
