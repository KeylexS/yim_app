import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Achievement } from 'src/app/services/achievement.service';

@Component({
  selector: 'app-achievement-toast',
  templateUrl: './achievement-toast.component.html',
  styleUrls: ['./achievement-toast.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AchievementToastComponent {
  @Input() achievement: Achievement | null = null;
  @Input() isVisible: boolean = false;
  @Output() dismiss = new EventEmitter<void>();

  onDismiss() {
    this.dismiss.emit();
  }

  getRarityColor(rarity: string): string {
    const colors = {
      'common': 'medium',
      'uncommon': 'success', 
      'rare': 'primary',
      'epic': 'warning'
    };
    return colors[rarity as keyof typeof colors] || 'medium';
  }
}
