import { Food } from "../interfaces/food";
// Función para transformar la respuesta de la API al formato de la interfaz Food
export function transformFoodResponse(apiResponse: any): Food {
  const foodData = apiResponse.parsed?.[0]?.food || apiResponse;

  return {
    id: foodData.foodId,
    name: foodData.label,
    caloriesPerGram: foodData.nutrients.ENERC_KCAL / 100 || 0,
    proteins: foodData.nutrients.PROCNT / 100 || 0,
    fats: foodData.nutrients.FAT / 100 || 0,
    carbohydrates: foodData.nutrients.CHOCDF / 100 || 0,
    gramQuantity: 100, 
    foodDesc: foodData.foodContentsLabel || 'No description available',
    image: foodData.image || '', // Agregar la imagen aquí
  };
}
