export interface Food {
    id: string;
    name: string;
    caloriesPerGram: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    gramQuantity: number;
    foodDesc?:string;
    image?:string;
}
