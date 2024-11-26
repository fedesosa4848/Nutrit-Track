import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { BarraBuscadoraComidasComponent } from "../../components/barra-buscadora-comidas/barra-buscadora-comidas.component";
import { FoodContainerComponent } from "../../components/food/food-container/food-container.component";
import { Food } from '../../interfaces/food';
import { FoodApiService } from '../../services/food-api.service';
import { FoodDetailComponent } from '../../components/food/food-detail/food-detail.component';
import { CommonModule } from '@angular/common';
import { HealthlabelComponent } from "../../components/food/healthlabel/healthlabel.component";
import { createEmptyFood } from '../../shared/factories';
@Component({
  selector: 'app-alimentos',
  standalone: true,
  imports: [BarraBuscadoraComidasComponent, FoodContainerComponent, CommonModule, HealthlabelComponent],
  templateUrl: './alimentos.component.html',
  styleUrl: './alimentos.component.css'
})
export class AlimentosComponent{

  

  //Este string nos llegara desde el componente de la barra de busqueda que emite dicho string
  foodNameRecived?: string;




  //Este array tomara los valores segun el metodo que busquemos
  arrayFoods: Food[] = [];

  //
  foodSelected: Food = createEmptyFood();


  healthLabel: string = '';  // Aquí se almacenará el health label seleccionado

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;   // Total de páginas (lo calcularemos después)

  foodTypeSelected?: string;

  isSearchByName: boolean = true;  // Variable de control para la búsqueda por nombre


  constructor(private _foodApi: FoodApiService) { }

  foodReciber(food: Food) {
    this.foodSelected = food;
  }


  searchFoodByName(foodName: string): void {
    this.isSearchByName = true;  // Activamos la búsqueda por nombre

    this.foodNameRecived = foodName

    this._foodApi.searchFoodByName(this.foodNameRecived).subscribe({
      next: (foods) => {
        this.arrayFoods = foods;
        console.log('Lista de alimentos recibida:', this.arrayFoods);
      },
      error: (err) => {
        console.error('Error al buscar alimentos:', err);
      },
    });
  }



  
  // Recibir el healthLabel desde el componente hijo
  onHealthLabelSelected(healthLabel: string): void {
    this.isSearchByName = false;  // Desactivamos la búsqueda por nombre

    this.healthLabel = healthLabel;
    this.currentPage = 1;  // Restablece la página actual a la primera
    console.log('Health label seleccionado:', healthLabel);
    this.searchFoodsByHealthLabel();  // Realiza la búsqueda cuando se selecciona un health label
  }

  

// Ir a la página siguiente
nextPage(): void {
  if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchFoodsByHealthLabel(); // Buscar alimentos para la nueva página
  }
}

// Ir a la página anterior
previousPage(): void {
  if (this.currentPage > 1) {
      this.currentPage--;
      this.searchFoodsByHealthLabel(); // Buscar alimentos para la nueva página
  }
}

// Buscar alimentos y calcular el total de páginas si es necesario
searchFoodsByHealthLabel(): void {
  this._foodApi.searchFoodByHealthLabel(this.healthLabel, this.currentPage, this.pageSize).subscribe(foods => {
      this.arrayFoods = foods;
      console.log('Alimentos recibidos:', foods);

      // Suponiendo que la API devuelve información sobre el total de resultados
      const totalResults = 100; // Cambiar por el dato real de la API si está disponible
      this.totalPages = Math.ceil(totalResults / this.pageSize); // Calcular el total de páginas
  });
}


trackByFn(index: number, item: Food): string {
  return item.id.toString(); // Convierte el ID a string si es un número
}





}
