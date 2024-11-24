import { User } from "../interfaces/user";

// Function to calculate Basal Metabolic Rate (BMR)
export function calculateBMR(user: User): number {
    const { weight, height, age, gender } = user.profile;
    let bmr: number;

    // Mifflin-St Jeor formula for BMR
    if (gender === "male") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    user.nutritionalData.bmr = bmr;
    return bmr;
}

// Function to calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(user: User): number {
    const bmr = user.nutritionalData.bmr;
    const activityLevel = user.profile.activityLevel;
    let activityFactor: number;

    // Define activity factor based on activity level
    switch (activityLevel) {
        case "sedentary":
            activityFactor = 1.2;
            break;
        case "light":
            activityFactor = 1.375;
            break;
        case "moderate":
            activityFactor = 1.55;
            break;
        case "active":
            activityFactor = 1.725;
            break;
        case "very active":
            activityFactor = 1.9;
            break;
        default:
            activityFactor = 1.2; // Default to sedentary
            break;
    }

    const tdee = bmr * activityFactor;
    user.nutritionalData.tdee = tdee;
    return tdee;
}

// Function to calculate calorie goals
export function calculateCalorieGoal(user: User): number {
    const tdee = user.nutritionalData.tdee;
    const goal = user.profile.goal;
    let calorieGoal: number;

    // Adjust calories based on goal
    if (goal === "bulking") {
        calorieGoal = tdee * 1.1; // 10% surplus
    } else if (goal === "deficit") {
        calorieGoal = tdee * 0.9; // 10% deficit
    } else {
        calorieGoal = tdee * 1; // Maintenance
    }

    user.nutritionalData.calorieGoal = calorieGoal;
    return calorieGoal;
}

// Function to calculate suggested macronutrients
export function calculateMacronutrients(user: User): { proteins: number, fats: number, carbohydrates: number } {
    const calorieGoal = user.nutritionalData.calorieGoal;

    // Macronutrient calculation values
    const proteinGrams = 1.925 * user.profile.weight; // In grams
    const proteinCalories = proteinGrams * 4; // 1 gram of protein = 4 calories
    const fatGrams = (calorieGoal * 0.25) / 9; // 1 gram of fat = 9 calories
    const fatCalories = fatGrams * 9; // Fat calories
    const remainingCalories = calorieGoal - (proteinCalories + fatCalories);
    const carbohydrateGrams = remainingCalories / 4; // 1 gram of carbohydrate = 4 calories

    const macronutrients = {
        proteins: Math.round(proteinGrams),
        fats: Math.round(fatGrams),
        carbohydrates: Math.round(carbohydrateGrams)
    };

    return macronutrients;
}
