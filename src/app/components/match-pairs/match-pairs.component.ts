// filepath: src/app/components/match-pairs/match-pairs.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-match-pairs',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './match-pairs.component.html',
  styleUrls: ['./match-pairs.component.scss']
})
export class MatchPairsComponent {
  @Input() data: any;
  @Output() completed = new EventEmitter<boolean>();

  selectedWord: string | null = null;
  matched: { [key: string]: string } = {};
  completedPairs: Set<string> = new Set();

  selectWord(word: string) {
    this.selectedWord = word;
  }

  selectImage(image: string) {
    if (this.selectedWord) {
      this.matched[this.selectedWord] = image;
      this.completedPairs.add(this.selectedWord);
      this.selectedWord = null;

      if (this.completedPairs.size === this.data.pairs.length) {
        setTimeout(() => this.completed.emit(true), 500);
      }
    }
  }
}
