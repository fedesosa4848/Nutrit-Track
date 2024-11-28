export interface Weather {
    location: string;
    temperature: number;
    description: string;
    message?: string; // Nuevo campo para el mensaje personalizado

  }
  
  export const weatherMessages = {
    cold: [
      { message: "Today is a great day for a hot chocolate.", emoji: "☕" },
      { message: "Perfect weather for enjoying a warm soup.", emoji: "🍲" },
      { message: "How about a nice cup of tea to warm up?", emoji: "🍵" },
      { message: "It's a perfect day for a cozy blanket and a movie.", emoji: "🛋️" },
      { message: "Time for some hot coffee or cocoa!", emoji: "☕" },
      { message: "A cold day like this calls for some comfort food.", emoji: "🍜" },
      { message: "Nothing beats a hot drink on a chilly day.", emoji: "🍹" },
      { message: "Perfect day for baking something warm and sweet.", emoji: "🍪" },
      { message: "A warm bowl of soup is just what you need today.", emoji: "🍲" },
      { message: "Wrap up in a blanket and enjoy something warm!", emoji: "🛏️" }
    ],
    cool: [
      { message: "It's a great day for a fruit smoothie.", emoji: "🍓" },
      { message: "An iced coffee would be perfect for this weather.", emoji: "🥶" },
      { message: "Time for a light snack in this cool weather.", emoji: "🍪" },
      { message: "A cold drink would hit the spot today.", emoji: "🥤" },
      { message: "How about a refreshing iced tea?", emoji: "🧋" },
      { message: "Perfect weather for a chilled smoothie bowl.", emoji: "🍓" },
      { message: "It's the ideal day for a fruit salad.", emoji: "🍉" },
      { message: "Cool days like this are made for cold brews.", emoji: "🍺" },
      { message: "A chilled glass of lemonade is just what you need.", emoji: "🍋" },
      { message: "A cold brew coffee would be refreshing today.", emoji: "☕" }
    ],
    warm: [
      { message: "A refreshing juice would be perfect today!", emoji: "🍊" },
      { message: "Perfect day for enjoying an ice cream.", emoji: "🍦" },
      { message: "How about a cold iced tea to keep you cool?", emoji: "🧋" },
      { message: "A nice fruit shake is just what you need today.", emoji: "🍓" },
      { message: "Time for a refreshing cold drink!", emoji: "🥤" },
      { message: "Today is perfect for an iced matcha latte.", emoji: "🍵" },
      { message: "Chilled fruit smoothies are calling your name.", emoji: "🍉" },
      { message: "A nice frosty beverage would be great today.", emoji: "🥶" },
      { message: "It's warm enough for a refreshing iced drink.", emoji: "🥤" },
      { message: "Cold fruit punch would be perfect right now!", emoji: "🍹" }
    ],
    hot: [
      { message: "The weather is perfect for a frozen smoothie!", emoji: "🍧" },
      { message: "How about a nice cold lemonade?", emoji: "🍋" },
      { message: "Today is perfect for sipping coconut water.", emoji: "🥥" },
      { message: "A popsicle would be amazing in this heat!", emoji: "🍦" },
      { message: "Time for a chilled iced coffee to cool down.", emoji: "🥶" },
      { message: "A nice cool drink to beat the heat today.", emoji: "🥤" },
      { message: "Stay cool with a refreshing fruit slush!", emoji: "🍧" },
      { message: "A chilled watermelon juice would be perfect now.", emoji: "🍉" },
      { message: "Perfect time for a cold cucumber drink.", emoji: "🥒" },
      { message: "How about a chilled sangria to relax?", emoji: "🍷" }
    ]
  };
  