import { Component, EventEmitter, Input, OnChanges, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { MealCardComponent } from "../meal-card/meal-card.component";
import { MealsService } from '../../../services/meals.service';
import { Meals } from '../../../interfaces/meals';
import { Food } from '../../../interfaces/food';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [MealCardComponent],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css'
})
export class MealListComponent implements OnInit, OnChanges {
  @Input() dateRecived?: string | null; //fecha que recibimos del componente de seleccionar fechas
  @Output() addModeEmitter = new EventEmitter(); //emite el evento de add-food a my-nutri-track
  @Output() mealTypeEmmiter = new EventEmitter(); //emite el mealType a my-nutri-track
  @Output() mealIdEmmiter = new EventEmitter(); //emite el mealId a my-nutri-track

  meal?: Meals;
  arrayBreakfast?: Food[];
  arrayLunch?: Food[];
  arraySnack?: Food[];
  arrayDinner?: Food[];
  mealTypeRecived?: 'breakfast' | 'lunch' | 'snack' | 'dinner';

  constructor(private _myMealsService: MealsService) { }


  //cuando se ejecuta se hace un GET de el MEAL de la fecha ACTUAL
  ngOnInit(): void {
    this.dateRecived = localStorage.getItem('loginDate');
    this._myMealsService.getUserMealByDate(this.dateRecived).subscribe(data => {
      this.meal = data[0];
      this.arrayBreakfast = this.meal.breakfast;
      this.arrayLunch = this.meal.lunch;
      this.arraySnack = this.meal.snack;
      this.arrayDinner = this.meal.dinner;
    });
  }
  
  //cuando cambia la fecha se vuelve a traer toda la info pero de la fecha seleccionada
  ngOnChanges(changes: SimpleChanges): void {
    this.arrayBreakfast = [];
    this.arrayLunch = [];
    this.arraySnack = [];
    this.arrayDinner = [];

    this._myMealsService.getUserMealByDate(this.dateRecived).subscribe(data => {
      this.meal = data[0];
      this.arrayBreakfast = this.meal.breakfast;
      this.arrayLunch = this.meal.lunch;
      this.arraySnack = this.meal.snack;
      this.arrayDinner = this.meal.dinner;
    });
  }

  reciveMealType(mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' | undefined) {
    this.mealTypeRecived = mealType;
  }
  
  deleteFoodFromMeal(food: Food) {
    if (this.mealTypeRecived) {
      this._myMealsService.deleteFoodFromMeal(this.meal?.id, food.id, this.mealTypeRecived)
        .toPromise()
        .then(() => {
          // Elimina el food del arreglo local correspondiente
          if (this.mealTypeRecived === 'breakfast') {
            this.arrayBreakfast = this.arrayBreakfast?.filter(f => f.id !== food.id);
          } else if (this.mealTypeRecived === 'lunch') {
            this.arrayLunch = this.arrayLunch?.filter(f => f.id !== food.id);
          } else if (this.mealTypeRecived === 'snack') {
            this.arraySnack = this.arraySnack?.filter(f => f.id !== food.id);
          } else if (this.mealTypeRecived === 'dinner') {
            this.arrayDinner = this.arrayDinner?.filter(f => f.id !== food.id);
          }
  
          // Recargar la página después de eliminar el alimento
          window.location.reload();
        })
        .catch(error => {
          console.error('Error al eliminar la comida:', error);
        });
    } else {
      console.log('NO MANDO NADA');
    }
  }






  updateFoodFromMeal(food: Food) {
    // Verificar que la cantidad de comida no sea menor que 0
    if (food.gramQuantity < 0) {
      alert("Please enter a valid quantity. The quantity cannot be less than 0.");
      return; // Evita que se haga la actualización si la cantidad es inválida
    }
  
    if (this.mealTypeRecived) {
      this._myMealsService.updateFoodFromMeal(this.meal?.id, food, this.mealTypeRecived)
        .toPromise()
        .then(() => {
          // Recargar la página una vez que la actualización se complete
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating the food:', error);
        });
    } else {
      console.log("Meal type not provided");
    }
  }

  
  
  //Le pasa el mealType y el mealId a my-nutri-track cunado se clickea el boton de + (añadir food)
  emitAddMode(mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' | undefined) {

    this.mealTypeEmmiter.emit(mealType);
    this.mealIdEmmiter.emit(this.meal?.id);
    this.addModeEmitter.emit()
  }

}
