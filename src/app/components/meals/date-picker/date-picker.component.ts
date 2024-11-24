import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() datePickedEmitter = new EventEmitter();
  date: string | null = '';

  ngOnInit(): void {
    this.date = localStorage.getItem('loginDate') || this.getCurrentDate();
  }

  emitDate() {
    this.datePickedEmitter.emit(this.date);
  }

  plusOneDay() {
    // if (this.date) {
    //   this.date = this.addOrSubtractDays(this.date, 1);
    //   this.emitDate();
    // }

    //lo cambie para que no pueda avanzar para adelante , si algun problema se vuelve a lo que esta comentado

    if (this.date) {
      const currentDate = this.getCurrentDate();
      const nextDate = this.addOrSubtractDays(this.date, 1);


      if (nextDate <= currentDate) {
        this.date = nextDate;
        this.emitDate();
      }
    }
  }




  minusOneDay() {
    if (this.date) {
      this.date = this.addOrSubtractDays(this.date, -1);
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
