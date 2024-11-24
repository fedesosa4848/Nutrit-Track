import { Component, OnInit } from '@angular/core';
import { MealListComponent } from "../../components/meals/meal-list/meal-list.component";
import { BarraBuscadoraComidasComponent } from '../../components/barra-buscadora-comidas/barra-buscadora-comidas.component';
import { FoodContainerComponent } from '../../components/food-container/food-container.component';
import { FoodApiService } from '../../services/food-api.service';
import { Food } from '../../interfaces/food';
import { FormsModule } from '@angular/forms';
import { MealsService } from '../../services/meals.service';
import { DatePickerComponent } from "../../components/meals/date-picker/date-picker.component";
import { lastValueFrom } from 'rxjs';
import { MealStatisticsComponent } from "../../components/meals/meal-statistics/meal-statistics.component";

@Component({
  selector: 'app-my-nutri-track',
  standalone: true,
  imports: [MealListComponent, BarraBuscadoraComidasComponent, FoodContainerComponent, FormsModule, DatePickerComponent, MealStatisticsComponent],
  templateUrl: './my-nutri-track.component.html',
  styleUrl: './my-nutri-track.component.css'
})
export class MyNutriTrackComponent  {
  addMode = false; //muestra o no el modo add-food
  arrayFoods?: Food[]; //array food q se usa en el addMode
  foodToAdd: Food = { id: 0, name: '', caloriesPerGram: 0, carbohydrates: 0, proteins: 0, fats: 0, gramQuantity: 0 }; //comida seleccionada para agregar
  foodQuantity: number = 0; //cantidad de comida seleccionada para agregar
  mealTypeRecived?: 'breakfast' | 'lunch' | 'snack' | 'dinner'; //mealType q se recibe de meal-list
  mealIdRecived?: number; //mealId que se recibe del meal-list
  dateRecivedFromDP?: string; //date que recibimos del datePicker (DP)

  constructor(private _myFoodService: FoodApiService, private _myMealService: MealsService) { }

  //llena el arrayFoods de todas las foods que coinciden con el foodName que se ingreso en el componenteBuscador
  foodNameReciver(foodName: string) {
    this._myFoodService.searchFoodByName(foodName).subscribe(data => {
      this.arrayFoods = data;
    })
  }

  //recibe la food seleccionada y le asigna la cantidad de gramos que se eligieron
  foodReciver(foodSelected: Food) {
    this.foodToAdd = foodSelected
  }

  //recibe de meal-list la mealType
  mealTypeReciver(mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') {
    this.mealTypeRecived = mealType;
  }

  //recibe de meal-list la mealId
  mealIdReciver(mealId: number) {
    this.mealIdRecived = mealId;
  }

  dateReciver(date: string) {
    this.dateRecivedFromDP = date;
  }

  //activa o desactiva el add-food-mode
  changeAddMode() {
    this.addMode = !this.addMode;
  }

  addFoodToMeal() {
    // Validación para asegurarse de que foodToAdd y foodQuantity son válidos
    if (!this.foodToAdd || !this.foodToAdd.id) {
      alert("Please select a valid food.");
      return;
    }
  
    if (this.foodQuantity <= 0 || isNaN(this.foodQuantity)) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }
  
    this.foodToAdd.gramQuantity = this.foodQuantity;
  
    lastValueFrom(
      this._myMealService.addFoodToMeal(this.mealIdRecived, this.foodToAdd, this.mealTypeRecived)
    )
      .then(() => {
        console.log("Food added successfully");  // Verifica que el código entre en este bloque
        // Recargar la página una vez que la adición se complete
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al añadir la comida:', error);
      });
  }
  
}
