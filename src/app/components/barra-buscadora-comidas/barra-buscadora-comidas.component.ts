import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-buscadora-comidas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './barra-buscadora-comidas.component.html',
  styleUrl: './barra-buscadora-comidas.component.css'
})
export class BarraBuscadoraComidasComponent {
  @Output() foodNameEmitter = new EventEmitter<string>();
  foodName?:string;

  emitSearch(){
    console.log(this.foodName);  // Verifica si el valor se emite correctamente

    this.foodNameEmitter.emit(this.foodName);
  }
}
