import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// ProgressService to manage the progress of classes
export class ProgressService {
  private storageKey = 'completedClasses';

  constructor() {}

  // Mark a class as complete and store it in localStorage    
  markClassComplete(classNumber: string) {
    const completed = this.getCompletedClasses();
    console.log('Current completed classes:', completed);
    if (!completed.includes(classNumber)) {
      completed.push(classNumber);
      localStorage.setItem(this.storageKey, JSON.stringify(completed));
      console.log('Marked class as complete:', classNumber);
      console.log('Updated completed classes:', completed);
    } else {
      console.log('Class already completed:', classNumber);
    }
  }

  // Check if a class is completed
  isClassCompleted(classNumber: string): boolean {
    return this.getCompletedClasses().includes(classNumber);
  }

  // Retrieve the list of completed classes from localStorage
  getCompletedClasses(): string[] {
    const completed = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    console.log('Retrieved completed classes from localStorage:', completed);
    return completed;
  }

  // Reset the progress by clearing the completed classes from localStorage
  resetProgress() {
    localStorage.removeItem(this.storageKey);
  }
}
