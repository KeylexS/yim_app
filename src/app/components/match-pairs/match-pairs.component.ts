import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Define the structure of a match pair
interface MatchPair {
  word: string;
  image: string;
}
// Component to match pairs of words and images
@Component({
  selector: 'app-match-pairs',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './match-pairs.component.html',
  styleUrls: ['./match-pairs.component.scss']
})

// MatchPairsComponent to handle matching pairs of words and images
export class MatchPairsComponent implements OnInit {
  @Input() data!: { pairs: MatchPair[] };
  @Output() completed = new EventEmitter<boolean>();

  selectedWord: string | null = null;
  matched: { [key: string]: string } = {};
  completedPairs: Set<string> = new Set();

  correctMatches: Set<string> = new Set();
  incorrectWord: string | null = null;

  shuffledWords: MatchPair[] = [];
  shuffledImages: MatchPair[] = [];

  // Initialize the component with shuffled pairs
  ngOnInit() {
    this.initializeShuffledArrays();
  }
  
  // Shuffle the pairs for random display
  private initializeShuffledArrays() {
    this.shuffledWords = [...this.data.pairs];
    this.shuffledImages = [...this.data.pairs];
    
    this.shuffleArray(this.shuffledWords);
    this.shuffleArray(this.shuffledImages);
  }

  // Shuffle an array in place
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Select a word for matching
  selectWord(word: string) {
    this.selectedWord = word;
    this.incorrectWord = null;
  } 

  // Select an image for matching
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
  
  // Get the color for a word based on its match status
  getWordColor(word: string): string {
    if (this.correctMatches.has(word)) return 'success';
    if (this.incorrectWord === word) return 'danger';
    if (this.selectedWord === word) return 'primary';
    return '';
  }
  // Get the color for an image based on its match status
  getImageColor(image: string): string {
    const pair = this.data.pairs.find(p => p.image === image);
    if (pair && this.correctMatches.has(pair.word)) {
      return 'success';
    }
    return '';
  }
}
