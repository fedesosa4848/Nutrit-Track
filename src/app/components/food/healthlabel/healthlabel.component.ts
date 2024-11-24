import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-healthlabel',
  standalone: true,
  imports: [],
  templateUrl: './healthlabel.component.html',
  styleUrl: './healthlabel.component.css'
})
export class HealthlabelComponent {
  @Output() healthEmitter = new EventEmitter<string>();

  emitHealthLabel(healthLabel: string): void {
    this.healthEmitter.emit(healthLabel);
  }
}
