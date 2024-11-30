import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CanvasJSAngularChartsModule, CanvasJS } from '@canvasjs/angular-charts';
import { Meal, MealType } from '../../../interfaces/meals';
import { Food } from '../../../interfaces/food';

CanvasJS.addColorSet("customColorSet", ["#ffcb06", "#ce1249", "#3a943c", "#7f3e83", "#812900", "#2078b6", "#df7f2e", "#e3e3e3"]);

@Component({
  selector: 'app-meal-chart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule],
  templateUrl: './meal-chart.component.html',
  styleUrls: ['./meal-chart.component.css']
})
export class MealChartComponent implements OnInit, OnChanges {
  @Input() meal: Meal | null = null; // Se recibe del componente padre

  totalCalories: number = 0;
  totalProteins: number = 0;
  totalCarbs: number = 0;
  totalFats: number = 0;

  chartOptions: any;

  ngOnInit(): void {
    console.log("Comidas recibidas en el gráfico:", JSON.stringify(this.meal, null, 2));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meal'] && this.meal) {
      this.calculateTotalNutrients(); // Actualiza los totales cuando cambie la comida
      this.createChart(); // Re-crea el gráfico
    }
  }

  calculateTotalNutrients(): void {
    // Reiniciamos los totales antes de calcular
    this.totalCalories = 0;
    this.totalProteins = 0;
    this.totalCarbs = 0;
    this.totalFats = 0;

    if (this.meal) {
      // Si solo hay una comida, la procesamos directamente
      const mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

      mealTypes.forEach(type => {
        const foods = this.meal![type as keyof Meal] as Food[] || [];
        if (foods.length > 0) {
          foods.forEach(food => {
            const calories = food.caloriesPerGram * food.gramQuantity;
            const proteins = food.proteins * food.gramQuantity;
            const carbs = food.carbohydrates * food.gramQuantity;
            const fats = food.fats * food.gramQuantity;

            // Sumamos los valores al total
            this.totalCalories += calories;
            this.totalProteins += proteins;
            this.totalCarbs += carbs;
            this.totalFats += fats;
          });
        }
      });
    }
  }

  createChart() {
    this.chartOptions = {
      animationEnabled: true,
      theme: "dark2",
      colorSet: "customColorSet",
      backgroundColor: "transparent", // Esto hace que el fondo sea transparente

      title: {
        text: "Distribución de Macronutrientes" // Título del gráfico
      },
      data: [{
        type: "doughnut",
        indexLabel: "{label}: {y}g", // Formato de índice para las etiquetas
        dataPoints: [
          { y: this.totalProteins.toFixed(2), label: "Proteínas" }, // Traducción de 'Proteínas'
          { y: this.totalCarbs.toFixed(2), label: "Carbohidratos" }, // Traducción de 'Carbohidratos'
          { y: this.totalFats.toFixed(2), label: "Grasas" } // Traducción de 'Grasas'
        ]
      }]
    };
  }
}
