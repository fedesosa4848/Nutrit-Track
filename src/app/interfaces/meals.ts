import { Food } from "./food";

export interface Meal {
    id?: string;
    idUser: string | null | undefined;
    date: string | null | undefined;
    breakfast?: Food[];
    lunch?: Food[];
    snack?: Food[];
    dinner?: Food[];
    dessert?:Food [];
    
}
