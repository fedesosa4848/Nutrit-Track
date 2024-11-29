import { Component, Input, OnChanges, OnInit,SimpleChanges } from '@angular/core';
import { CanvasJSAngularChartsModule, CanvasJS } from '@canvasjs/angular-charts';
import { Meal,MealType } from '../../../interfaces/meals';
import { Food } from '../../../interfaces/food';
CanvasJS.addColorSet("customColorSet", ["#ffcb06", "#ce1249", "#3a943c", "#7f3e83", "#812900", "#2078b6", "#df7f2e", "#e3e3e3"]);

@Component({
  selector: 'app-meal-chart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule],
  templateUrl: './meal-chart.component.html',
  styleUrl: './meal-chart.component.css'
})
export class MealChartComponent  implements OnInit,OnChanges {
  @Input() meal: Meal[] | null = null;

  totalCalories: number = 0;
  totalProteins: number = 0;
  totalCarbs: number = 0;
  totalFats: number = 0;

  chartOptions: any;

  ngOnInit(): void {
    console.log("Comidas recibidas en el gráfico:", this.meal);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meal'] && this.meal) {
      this.calculateTotalNutrients();
      this.createChart();
    }
  }

  calculateTotalNutrients(): void {
    // Reiniciamos los totales antes de calcular
    this.totalCalories = 0;
    this.totalProteins = 0;
    this.totalCarbs = 0;
    this.totalFats = 0;
  
    // Tipos de comidas que vamos a recorrer
    const mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];
  
    this.meal?.forEach(singleMeal => {
      console.log(`\nComenzando el cálculo para la comida del día: ${singleMeal.date}`);
  
      mealTypes.forEach(type => {
        const foods = singleMeal[type as keyof Meal] as Food[] || [];
        if (foods.length > 0) {
          console.log(`\nTipo de comida: ${type}`);
  
          foods.forEach(food => {
            const calories = food.caloriesPerGram * food.gramQuantity;
            const proteins = food.proteins * food.gramQuantity;
            const carbs = food.carbohydrates * food.gramQuantity;
            const fats = food.fats * food.gramQuantity;
  
            console.log(
              `\nAlimento: ${food.name}\n` +
              `  - Calorías por gramo: ${food.caloriesPerGram}\n` +
              `  - Cantidad en gramos: ${food.gramQuantity}\n` +
              `  - Calorías: ${calories.toFixed(2)}\n` +
              `  - Proteínas: ${proteins.toFixed(2)}\n` +
              `  - Carbohidratos: ${carbs.toFixed(2)}\n` +
              `  - Grasas: ${fats.toFixed(2)}`
            );
  
            // Sumamos los valores al total
            this.totalCalories += calories;
            this.totalProteins += proteins;
            this.totalCarbs += carbs;
            this.totalFats += fats;
          });
        }
      });
    });
  
    // Depuración final de los totales
    console.log(`\nTotales del día:`);
    console.log(`  - Calorías totales: ${this.totalCalories.toFixed(2)}`);
    console.log(`  - Proteínas totales: ${this.totalProteins.toFixed(2)}g`);
    console.log(`  - Carbohidratos totales: ${this.totalCarbs.toFixed(2)}g`);
    console.log(`  - Grasas totales: ${this.totalFats.toFixed(2)}g`);
  }
  
  

  createChart() {
    this.chartOptions = {
      animationEnabled: true,
      theme: "dark2",
      colorSet: "customColorSet",
      backgroundColor: "transparent", // Esto hace que el fondo sea transparente
  
      title: {
        text: "Macronutrient Distribution" // Traducción del título
      },
      data: [{
        type: "doughnut",
        indexLabel: "{label}: {y}g", // Mantiene el formato de índice para las etiquetas
        dataPoints: [
          { y: this.totalProteins.toFixed(2), label: "Proteins" }, // Traducción de 'Proteínas'
          { y: this.totalCarbs.toFixed(2), label: "Carbohydrates" }, // Traducción de 'Carbohidratos'
          { y: this.totalFats.toFixed(2), label: "Fats" } // Traducción de 'Grasas'
        ]
      }]
    };
  }
  
}
