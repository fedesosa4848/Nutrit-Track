import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';
import { Weather, weatherMessages } from '../../interfaces/weather';

@Component({
  selector: 'app-weathemodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weathemodal.component.html',
  styleUrls: ['./weathemodal.component.css']
})
export class WeathemodalComponent implements OnInit, AfterViewInit {
  weather: Weather | null = null;
  errorMessage: string | null = null;
  
  @Output() close = new EventEmitter<void>(); // Emite el evento al cerrar el modal
  @Output() weatherEmitter = new EventEmitter<Weather>(); // Emite el clima al cerrar el modal
  
  @ViewChild('weatherDialog') weatherDialog!: ElementRef<HTMLDialogElement>;
  isDialogOpen = true;

  constructor(
    private geolocationService: GeolocationService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.geolocationService.getCurrentLocation().subscribe({
      next: (coords) => {
        this.fetchWeather(coords.latitude, coords.longitude);
      },
      error: () => {
        this.errorMessage = 'Usando ubicación predeterminada: Buenos Aires.';
        this.fetchWeather(-34.6037, -58.3816);
      }
    });

    // Solo se abrirá el modal después de que se haya renderizado la vista
    setTimeout(() => this.openDialog(), 5000);  // Para abrirlo después de 5 segundos
  }

  ngAfterViewInit(): void {
    // Se asegura de que `weatherDialog` esté disponible para usar
    if (this.weatherDialog) {
      this.openDialog();  // Abre el modal inmediatamente al completar la inicialización
    }
  }

  fetchWeather(lat: number, lon: number): void {
    this.weatherService.getLocationKey(lat, lon).subscribe({
      next: (response) => {
        this.weatherService.getCurrentWeather(response.Key).subscribe({
          next: (weatherData) => {
            const temp = weatherData[0].Temperature.Metric.Value;
            console.log(temp);
            this.weather = {
              location: `${response.LocalizedName}`,
              temperature: weatherData[0].Temperature.Metric.Value,
              description: weatherData[0].WeatherText,
              message: this.getWeatherMessage(temp) // Obtener el mensaje según la temperatura

            };
          }
        });
      }
    });
  }

  openDialog(): void {
    if (this.weatherDialog && this.weatherDialog.nativeElement) {
      this.weatherDialog.nativeElement.showModal();
    }
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    if (this.weatherDialog && this.weatherDialog.nativeElement) {
      this.weatherDialog.nativeElement.close();
    }
    if (this.weather) {
      this.weatherEmitter.emit(this.weather); // Emitir el clima al cerrar el modal
    }
    this.close.emit();
  }

   // Función para obtener el mensaje basado en la temperatura
   // Función para obtener el mensaje basado en la temperatura
getWeatherMessage(temperature: number): string {
  if (temperature <= 5) {
    const { message, emoji } = this.getRandomMessage(weatherMessages.cold);
    return `${message} ${emoji}`;
  } else if (temperature <= 10) {
    const { message, emoji } = this.getRandomMessage(weatherMessages.cool);
    return `${message} ${emoji}`;
  } else if (temperature <= 20) {
    const { message, emoji } = this.getRandomMessage(weatherMessages.warm);
    return `${message} ${emoji}`;
  } else {
    const { message, emoji } = this.getRandomMessage(weatherMessages.hot);
    return `${message} ${emoji}`;
  }
}

// Función para obtener un mensaje aleatorio de un array
getRandomMessage(messages: { message: string, emoji: string }[]): { message: string, emoji: string } {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

}
