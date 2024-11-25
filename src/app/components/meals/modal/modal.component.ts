import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() mealId!: string;
  @Input() typeMeal!: string;
  @Output() foodSelected = new EventEmitter<{ food: string; gramQuantity: number }>();
  @Output() modalClosed = new EventEmitter<void>();

  searchQuery = '';

  addFood() {
    // Enviar alimento con gramaje (esto se ajusta a tu lógica real)
    const food = { food: this.searchQuery, gramQuantity: 100 }; // Ejemplo
    this.foodSelected.emit(food);
    this.closeModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
