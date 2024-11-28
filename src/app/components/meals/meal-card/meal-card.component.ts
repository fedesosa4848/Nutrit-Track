import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../../interfaces/meals';
import { ModalComponent } from '../modal/modal.component';
import { Food } from '../../../interfaces/food';
import { MealService } from '../../../services/meal.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, ModalComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {
  @Input() meal: Meal = {
    id: '',
    idUser: '',
    date: '',
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    dessert: []
  };

  selectedTypeMeal: MealType | null = null;
  mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

  editingFoodId: string | null = null; // ID del alimento que se está editando
  newGramQuantity: number = 0; // Cantidad de gramos nueva

  foodForm: FormGroup; // Declaramos el formulario reactivo



  constructor(private mealService: MealService, private fb:FormBuilder) {
    // Inicializamos el formulario
    this.foodForm = this.fb.group({
      gramQuantity: ['',[Validators.min(10), Validators.max(1000)]]
    });
  }
  ngOnInit() {
    console.log('Comida recibida en el componente:', this.meal);
  }

  closeModal() {
    this.selectedTypeMeal = null; // Cerrar modal
  }

  openModal(type: MealType) {
    this.selectedTypeMeal = type; // Abrir modal para el tipo de comida
    console.log('Modal abierto con tipo de comida:', this.selectedTypeMeal);
  }

  removeFood(typeMeal: MealType, foodId: string) {
    this.mealService.removeFoodFromMeal(this.meal, typeMeal, foodId).subscribe(
      (updatedMeal) => {
        console.log('Alimento eliminado:', foodId);
        this.meal = updatedMeal; // Actualizar la comida en la interfaz
      }
    );
  }

 
  

 
  startEditingFood(typeMeal: MealType, foodId: string) {
    console.log('startEditingFood llamado con:', { typeMeal, foodId });
    const food = this.getFoodById(typeMeal, foodId);
    console.log('Resultado de getFoodById:', food);
  
    if (food) {
      this.editingFoodId = foodId;
      this.foodForm.setValue({ gramQuantity: food.gramQuantity }); // Establecemos el valor inicial en el formulario reactivo
      console.log('Editando comida con ID:', this.editingFoodId, 'Cantidad:', this.foodForm.value.gramQuantity);
    } else {
      console.error('No se encontró la comida con ID:', foodId);
    }
  }

  updateFoodQuantity(typeMeal: MealType, foodId: string) {
    console.log('Botón guardar presionado para actualizar la cantidad de:', { typeMeal, foodId });

    if (this.foodForm.invalid) {
      alert('La cantidad debe estar entre 10 y 1000 gramos.');
      return;
    }

    const newGramQuantity = this.foodForm.value.gramQuantity; // Obtener el valor del formulario reactivo

    // Verificar si el valor ha cambiado antes de actualizar
    const food = this.getFoodById(typeMeal, foodId);
    if (food && food.gramQuantity === newGramQuantity) {
      console.log('No hay cambios en la cantidad, no se actualiza.');
      return; // No actualizar si no hay cambios
    }

    console.log('Actualizando alimento:', { 
      mealId: this.meal.id, 
      typeMeal, 
      foodId, 
      newGramQuantity 
    });

    this.mealService.updateFoodQuantity(this.meal, typeMeal, foodId, newGramQuantity).subscribe(
      (updatedMeal) => {
        console.log('Cantidad actualizada para el alimento:', foodId);
        this.meal = updatedMeal;
        this.cancelEditing(); // Salir del modo edición
      }
    );
  }

  cancelEditing() {
    this.editingFoodId = null;
    this.foodForm.reset(); // Resetear el formulario
  }

  mostrarMensaje(): void {
    console.log('¡Hola! Apretaste un botón'); // Este mensaje debería aparecer en la consola
  }
  

  // Obtener un alimento por su ID
  private getFoodById(typeMeal: MealType, foodId: string): Food | undefined {
    return this.meal[typeMeal].find((food) => food.id === foodId);
  }
}
