import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input() caloriesNeeded: number = 0;
  @Input() caloriesConsumed: number = 0;
  progress: number = 0;
  offset: number = 0;
  circumference: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    this.calculateProgress();
  }

  // Calcular el porcentaje de progreso
  calculateProgress() {
    if (this.caloriesNeeded > 0) {
      this.progress = (this.caloriesConsumed / this.caloriesNeeded) * 100;
    } else {
      this.progress = 0;
    }
    this.updateProgress();
  }

  // Actualizar el desplazamiento del trazo de la barra
  updateProgress() {
    const radius = 50;
    this.circumference = 2 * Math.PI * radius;
    this.offset = this.circumference - (this.progress / 100) * this.circumference;
  }
}
