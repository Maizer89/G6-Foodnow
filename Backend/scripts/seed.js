const ingredientsData = [
  {
    name_singular: "Tomat",
    name_plural: "Tomater",
  },
  {
    name_singular: "Pasta",
    name_plural: "Pastor",
  },
  {
    name_singular: "Ost",
    name_plural: "Ostar",
  },
  {
    name_singular: "Kyckling",
    name_plural: "Kycklingar",
  },
  {
    name_singular: "Vitlök",
    name_plural: "Vitlökar",
  },
  {
    name_singular: "Lök",
    name_plural: "Lökar",
  },
  {
    name_singular: "Ris",
    name_plural: "Ris",
  },
  {
    name_singular: "Basilika",
    name_plural: "Basilikablad",
  },
  {
    name_singular: "Smör",
    name_plural: "Smör",
  },
  {
    name_singular: "Paprika",
    name_plural: "Paprikor",
  },
];

const recipesData = [
  {
    title: "Krämig Tomatpasta",
    description: "En snabb och krämig pasta med tomatsås.",
    cooking_time_minutes: 20,

    instructions: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Koka pastan och blanda med tomatsås och ost.",
          },
        ],
      },
    ],

    ingredients: [
      {
        ingredient: "Tomat",
        amount: "2",
        unit: "st",
      },
      {
        ingredient: "Pasta",
        amount: "300",
        unit: "g",
      },
      {
        ingredient: "Ost",
        amount: "100",
        unit: "g",
      },
    ],
  },

  {
    title: "Vitlökskyckling",
    description: "Saftig kyckling med vitlökssmör.",
    cooking_time_minutes: 35,

    instructions: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Stek kycklingen och tillsätt vitlök och smör.",
          },
        ],
      },
    ],

    ingredients: [
      {
        ingredient: "Kyckling",
        amount: "500",
        unit: "g",
      },
      {
        ingredient: "Vitlök",
        amount: "3",
        unit: "klyftor",
      },
      {
        ingredient: "Smör",
        amount: "50",
        unit: "g",
      },
    ],
  },

  {
    title: "Vegetarisk Riswok",
    description: "En enkel wok med ris och grönsaker.",
    cooking_time_minutes: 25,

    instructions: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Stek grönsakerna och servera med ris.",
          },
        ],
      },
    ],

    ingredients: [
      {
        ingredient: "Ris",
        amount: "200",
        unit: "g",
      },
      {
        ingredient: "Paprika",
        amount: "1",
        unit: "st",
      },
      {
        ingredient: "Lök",
        amount: "1",
        unit: "st",
      },
    ],
  },
];

async function seed(strapi) {
  console.log("Startar seed...");

  // =====================
  // INGREDIENTS
  // =====================

  const ingredientMap = {};

  for (const ingredient of ingredientsData) {
    const createdIngredient =
      await strapi.entityService.create(
        "api::ingredient.ingredient",
        {
          data: {
            ...ingredient,
            publishedAt: new Date(),
          },
        }
      );

    ingredientMap[ingredient.name_singular] =
      createdIngredient.id;

    console.log(
      `Ingrediens skapad: ${ingredient.name_singular}`
    );
  }

  // =====================
  // RECIPES
  // =====================

  for (const recipe of recipesData) {
    const formattedIngredients =
      recipe.ingredients.map((item) => ({
        amount: item.amount,
        unit: item.unit,
        note: "",

        ingredient:
          ingredientMap[item.ingredient],
      }));

    await strapi.entityService.create(
      "api::recipe.recipe",
      {
        data: {
          title: recipe.title,
          description: recipe.description,

          cooking_time_minutes:
            recipe.cooking_time_minutes,

          instructions:
            recipe.instructions,

          ingredients:
            formattedIngredients,

          publishedAt: new Date(),
        },
      }
    );

    console.log(
      `Recept skapat: ${recipe.title}`
    );
  }

  console.log("Seed klar!");
}

module.exports = seed;