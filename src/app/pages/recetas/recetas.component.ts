import { Component } from '@angular/core';
import { RecetasService } from '../../services/recetas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.css'
})
export class RecetasComponent {
  searchMethod: string = 'nombre';  // Método de búsqueda por defecto
  searchTerm: string = '';          // Término de búsqueda
  recetas: any[] = [];             // Almacena los resultados

  constructor(private recetasService: RecetasService) { }

  // Ejecutar la búsqueda según el tipo seleccionado
  buscarRecetas(): void {
    if (this.searchMethod === 'nombre') {
      this.recetasService.buscarPorNombre(this.searchTerm).subscribe(data => {
        this.recetas = data.meals || [];
      });
    } else if (this.searchMethod === 'categoria') {
      this.recetasService.buscarPorCategoria(this.searchTerm).subscribe(data => {
        this.recetas = data.meals || [];
      });
    } else if (this.searchMethod === 'ingrediente') {
      this.recetasService.buscarPorIngrediente(this.searchTerm).subscribe(data => {
        this.recetas = data.meals || [];
      });
    }
  }

  getIngredients(receta: any) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = receta[`strIngredient${i}`];
      const measure = receta[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  }
  
}
