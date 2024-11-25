import { Food } from '../interfaces/food';
import { Meal } from '../interfaces/meals';
export function createEmptyFood(): Food {
  return {
    id: '', // o un valor inicial que consideres adecuado, 0 puede indicar que aún no tiene ID
    name: '', // Nombre vacío
    caloriesPerGram: 0, // Calorías por gramo en 0
    carbohydrates: 0, // Carbohidratos en 0
    proteins: 0, // Proteínas en 0
    fats: 0, // Grasas en 0
    gramQuantity: 0, // Cantidad en gramos en 0
    foodDesc: '', // Descripción vacía (opcional)
    image: '', // Imagen vacía (opcional)
  };
}



export function createEmptyMeal(userId: string , date: string ): Meal {
    return {
        id: '',
        idUser: userId,
        date: date,
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: [],
        dessert: []
    };
}
