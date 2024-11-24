import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() datePickedEmitter = new EventEmitter();
  date: string = '';
  currentDate: string = '';
  maxDate: string = ''; // Fecha máxima (7 días adelante)
  minDate: string = ''; // Fecha mínima (30 días atrás)
  errorMessage: string = ''; // Mensaje de error

  ngOnInit(): void {
    this.currentDate = this.getCurrentDate();
    this.maxDate = this.addOrSubtractDays(this.currentDate, 7); // 7 días adelante
    this.minDate = this.addOrSubtractDays(this.currentDate, -30); // 30 días atrás
    this.date = localStorage.getItem('loginDate') || this.currentDate;
  }

  emitDate() {
    console.log('Emitiendo la fecha:', this.date);  // Mensaje de depuración
    this.datePickedEmitter.emit(this.date);
  }

  plusOneDay() {
    const nextDate = this.addOrSubtractDays(this.date, 1);

    // Verificamos si la fecha se encuentra dentro del rango permitido
    if (nextDate > this.maxDate) {
      this.errorMessage = 'No puedes avanzar más de 7 días desde la fecha actual.';
    } else {
      this.errorMessage = '';
      this.date = nextDate;
      this.emitDate();
    }
  }

  minusOneDay() {
    const prevDate = this.addOrSubtractDays(this.date, -1);

    // Verificamos si la fecha se encuentra dentro del rango permitido
    if (prevDate < this.minDate) {
      this.errorMessage = 'No puedes retroceder más de 30 días desde la fecha actual.';
    } else {
      this.errorMessage = '';
      this.date = prevDate;
      this.emitDate();
    }
  }

  private addOrSubtractDays(dateString: string, days: number): string {
    const date = new Date(dateString + 'T00:00:00'); // Evitar desfase horario
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
