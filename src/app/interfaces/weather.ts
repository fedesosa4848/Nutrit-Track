export interface Weather {
    location: string;
    temperature: number;
    description: string;
    message?: string; // Nuevo campo para el mensaje personalizado

  }
  
  export const weatherMessages = {
    cold: [
      "Today is a great day for a hot chocolate.",
      "Perfect weather for enjoying a warm soup.",
      "How about a nice cup of tea to warm up?",
      "It's a perfect day for a cozy blanket and a movie.",
      "Time for some hot coffee or cocoa!",
      "A cold day like this calls for some comfort food.",
      "Nothing beats a hot drink on a chilly day.",
      "Perfect day for baking something warm and sweet.",
      "A warm bowl of soup is just what you need today.",
      "Wrap up in a blanket and enjoy something warm!"
    ],
    cool: [
      "It's a great day for a fruit smoothie.",
      "An iced coffee would be perfect for this weather.",
      "Time for a light snack in this cool weather.",
      "A cold drink would hit the spot today.",
      "How about a refreshing iced tea?",
      "Perfect weather for a chilled smoothie bowl.",
      "It's the ideal day for a fruit salad.",
      "Cool days like this are made for cold brews.",
      "A chilled glass of lemonade is just what you need.",
      "A cold brew coffee would be refreshing today."
    ],
    warm: [
      "A refreshing juice would be perfect today!",
      "Perfect day for enjoying an ice cream.",
      "How about a cold iced tea to keep you cool?",
      "A nice fruit shake is just what you need today.",
      "Time for a refreshing cold drink!",
      "Today is perfect for an iced matcha latte.",
      "Chilled fruit smoothies are calling your name.",
      "A nice frosty beverage would be great today.",
      "It's warm enough for a refreshing iced drink.",
      "Cold fruit punch would be perfect right now!"
    ],
    hot: [
      "The weather is perfect for a frozen smoothie!",
      "How about a nice cold lemonade?",
      "Today is perfect for sipping coconut water.",
      "A popsicle would be amazing in this heat!",
      "Time for a chilled iced coffee to cool down.",
      "A nice cool drink to beat the heat today.",
      "Stay cool with a refreshing fruit slush!",
      "A chilled watermelon juice would be perfect now.",
      "Perfect time for a cold cucumber drink.",
      "How about a chilled sangria to relax?"
    ]
  };
  