// Basic user information
export interface UserProfile {
    id?: string;
    firstName: string; // Previously 'nombre'
    lastName: string;  // Previously 'apellido'
    email: string;
    password: string;
    age: number;       // Previously 'edad'
    gender: string;    // 'male', 'female', 'other' - Previously 'genero'
    weight: number;    // In kg, previously 'peso'
    height: number;    // In cm, previously 'altura'
    goal: string;      // 'bulking', 'deficit', 'maintenance' - Previously 'perfil'
    activityLevel: string; // 'sedentary', 'light', 'moderate', 'active', 'very active' - Previously 'nivelActividad'
}

// User nutritional data
export interface NutritionalData {
    bmr: number; // Basal Metabolic Rate - Previously 'tmb'
    tdee: number; // Total Daily Energy Expenditure
    calorieGoal: number; // Previously 'caloriasObjetivo'
    macronutrients: { // Suggested macronutrients
        proteins: number;      // In grams, previously 'proteinas'
        carbohydrates: number; // In grams, previously 'carbohidratos'
        fats: number;          // In grams, previously 'grasas'
    };
}

// Main User interface
export interface User {
    id?: string;
    profile: UserProfile;
    nutritionalData: NutritionalData;
}
