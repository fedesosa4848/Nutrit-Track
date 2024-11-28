import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { Weather } from '../../interfaces/weather';
import { WeathemodalComponent } from "../../components/weathemodal/weathemodal.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, WeathemodalComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  userName: string | null = null;
  isWeatherModalClosed: boolean = false;
  weather: Weather | null = null; // Almacena la información del clima

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserName();
  }

  loadUserName(): void {
    const userId = localStorage.getItem('userToken');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (userData: User) => {
          this.userName = userData.profile.firstName;
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      });
    }
  }

  closeWeatherModal(): void {
    this.isWeatherModalClosed = true;
  }

  updateWeather(weather: Weather): void {
    this.weather = weather; // Actualiza el clima en el Landing
  }
}
