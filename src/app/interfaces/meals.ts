import { Food } from "./food";

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'dessert';

export interface Meal {
  id: string;
  idUser: string;
  date: string;
  breakfast: Food[];
  lunch: Food[];
  snack: Food[];
  dinner: Food[];
  dessert: Food[];
}
