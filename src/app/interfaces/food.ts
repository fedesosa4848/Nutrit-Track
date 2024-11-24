export interface Food {
    id: number;
    name: string;
    caloriesPerGram: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    gramQuantity: number;
    foodDesc?:string;
    image?:string;
}
