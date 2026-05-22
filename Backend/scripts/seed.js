const fs = require("fs");
const path = require("path");

const categoriesData = [
  "Grönsaker",
  "Frukt",
  "Bär",
  "Färska örter",
  "Kryddor",
  "Kött",
  "Fågel",
  "Fisk & skaldjur",
  "Mejeri",
  "Ost",
  "Ägg",
  "Pasta & nudlar",
  "Ris & gryn",
  "Bakning",
  "Bröd",
  "Baljväxter",
  "Konserver",
  "Frysta varor",
  "Nötter & frön",
  "Oljor & fetter",
  "Såser & dressingar",
  "Buljong & fond",
  "Sötningsmedel",
  "Drycker",
  "Vegetariskt & veganskt",
  "Glutenfritt",
  "Snacks & tillbehör",
];

const ingredientsData = [
  // =====================
  // GRÖNSAKER
  // =====================

  {
    name_singular: "Tomat",
    name_plural: "Tomater",
    category: "Grönsaker",
  },
  {
    name_singular: "Lök",
    name_plural: "Lökar",
    category: "Grönsaker",
  },
  {
    name_singular: "Morot",
    name_plural: "Morötter",
    category: "Grönsaker",
  },
  {
    name_singular: "Paprika",
    name_plural: "Paprikor",
    category: "Grönsaker",
  },
  {
    name_singular: "Broccoli",
    name_plural: "Broccolibuketter",
    category: "Grönsaker",
  },

  // =====================
  // FRUKT
  // =====================

  {
    name_singular: "Äpple",
    name_plural: "Äpplen",
    category: "Frukt",
  },
  {
    name_singular: "Citron",
    name_plural: "Citroner",
    category: "Frukt",
  },
  {
    name_singular: "Banan",
    name_plural: "Bananer",
    category: "Frukt",
  },
  {
    name_singular: "Avokado",
    name_plural: "Avokador",
    category: "Frukt",
  },

  // =====================
  // BÄR
  // =====================

  {
    name_singular: "Jordgubbe",
    name_plural: "Jordgubbar",
    category: "Bär",
  },
  {
    name_singular: "Blåbär",
    name_plural: "Blåbär",
    category: "Bär",
  },
  {
    name_singular: "Hallon",
    name_plural: "Hallon",
    category: "Bär",
  },

  // =====================
  // FÄRSKA ÖRTER
  // =====================

  {
    name_singular: "Basilika",
    name_plural: "Basilikablad",
    category: "Färska örter",
  },
  {
    name_singular: "Persilja",
    name_plural: "Persiljekvistar",
    category: "Färska örter",
  },
  {
    name_singular: "Dill",
    name_plural: "Dillkvistar",
    category: "Färska örter",
  },
  {
    name_singular: "Koriander",
    name_plural: "Korianderblad",
    category: "Färska örter",
  },

  // =====================
  // KRYDDOR
  // =====================

  {
    name_singular: "Svartpeppar",
    name_plural: "Svartpeppar",
    category: "Kryddor",
  },
  {
    name_singular: "Oregano",
    name_plural: "Oregano",
    category: "Kryddor",
  },
  {
    name_singular: "Paprikapulver",
    name_plural: "Paprikapulver",
    category: "Kryddor",
  },
  {
    name_singular: "Curry",
    name_plural: "Curry",
    category: "Kryddor",
  },
  {
    name_singular: "Vitlök",
    name_plural: "Vitlökar",
    category: "Kryddor",
  },

  // =====================
  // KÖTT
  // =====================

  {
    name_singular: "Nötkött",
    name_plural: "Nötkött",
    category: "Kött",
  },
  {
    name_singular: "Fläskkött",
    name_plural: "Fläskkött",
    category: "Kött",
  },
  {
    name_singular: "Bacon",
    name_plural: "Bacon",
    category: "Kött",
  },

  // =====================
  // FÅGEL
  // =====================

  {
    name_singular: "Kyckling",
    name_plural: "Kycklingar",
    category: "Fågel",
  },
  {
    name_singular: "Kycklingfilé",
    name_plural: "Kycklingfiléer",
    category: "Fågel",
  },
  {
    name_singular: "Kalkon",
    name_plural: "Kalkoner",
    category: "Fågel",
  },

  // =====================
  // FISK & SKALDJUR
  // =====================

  {
    name_singular: "Lax",
    name_plural: "Laxfiléer",
    category: "Fisk & skaldjur",
  },
  {
    name_singular: "Torsk",
    name_plural: "Torskfiléer",
    category: "Fisk & skaldjur",
  },
  {
    name_singular: "Räka",
    name_plural: "Räkor",
    category: "Fisk & skaldjur",
  },
  {
    name_singular: "Mussla",
    name_plural: "Musslor",
    category: "Fisk & skaldjur",
  },

  // =====================
  // MEJERI
  // =====================

  {
    name_singular: "Mjölk",
    name_plural: "Mjölk",
    category: "Mejeri",
  },
  {
    name_singular: "Grädde",
    name_plural: "Grädde",
    category: "Mejeri",
  },
  {
    name_singular: "Smör",
    name_plural: "Smör",
    category: "Mejeri",
  },
  {
    name_singular: "Yoghurt",
    name_plural: "Yoghurt",
    category: "Mejeri",
  },

  // =====================
  // OST
  // =====================

  {
    name_singular: "Parmesan",
    name_plural: "Parmesanostar",
    category: "Ost",
  },
  {
    name_singular: "Cheddar",
    name_plural: "Cheddarostar",
    category: "Ost",
  },
  {
    name_singular: "Mozzarella",
    name_plural: "Mozzarellaostar",
    category: "Ost",
  },
  {
    name_singular: "Fetaost",
    name_plural: "Fetaostar",
    category: "Ost",
  },
  {
    name_singular: "Ost",
    name_plural: "Ostar",
    category: "Ost",
  },

  // =====================
  // ÄGG
  // =====================

  {
    name_singular: "Ägg",
    name_plural: "Ägg",
    category: "Ägg",
  },

  // =====================
  // PASTA & NUDLAR
  // =====================

  {
    name_singular: "Pasta",
    name_plural: "Pastor",
    category: "Pasta & nudlar",
  },
  {
    name_singular: "Spaghetti",
    name_plural: "Spaghettistrån",
    category: "Pasta & nudlar",
  },
  {
    name_singular: "Penne",
    name_plural: "Pennepastor",
    category: "Pasta & nudlar",
  },
  {
    name_singular: "Ramen nudel",
    name_plural: "Ramen nudlar",
    category: "Pasta & nudlar",
  },

  // =====================
  // RIS & GRYN
  // =====================

  {
    name_singular: "Ris",
    name_plural: "Ris",
    category: "Ris & gryn",
  },
  {
    name_singular: "Jasminris",
    name_plural: "Jasminris",
    category: "Ris & gryn",
  },
  {
    name_singular: "Quinoa",
    name_plural: "Quinoa",
    category: "Ris & gryn",
  },
  {
    name_singular: "Bulgur",
    name_plural: "Bulgur",
    category: "Ris & gryn",
  },
  {
    name_singular: "Havregryn",
    name_plural: "Havregryn",
    category: "Ris & gryn",
  },

  // =====================
  // BAKNING
  // =====================

  {
    name_singular: "Vetemjöl",
    name_plural: "Vetemjöl",
    category: "Bakning",
  },
  {
    name_singular: "Jäst",
    name_plural: "Jäst",
    category: "Bakning",
  },
  {
    name_singular: "Ströbröd",
    name_plural: "Ströbröd",
    category: "Bakning",
  },
  {
    name_singular: "Kakao",
    name_plural: "Kakao",
    category: "Bakning",
  },
  {
    name_singular: "Vaniljsocker",
    name_plural: "Vaniljsocker",
    category: "Bakning",
  },
  {
    name_singular: "Choklad",
    name_plural: "Chokladbitar",
    category: "Bakning",
  },

  // =====================
  // BRÖD
  // =====================

  {
    name_singular: "Tortilla",
    name_plural: "Tortillas",
    category: "Bröd",
  },
  {
    name_singular: "Tunnbröd",
    name_plural: "Tunnbröd",
    category: "Bröd",
  },
  {
    name_singular: "Knäckebröd",
    name_plural: "Knäckebröd",
    category: "Bröd",
  },

  // =====================
  // BALJVÄXTER
  // =====================

  {
    name_singular: "Kikärta",
    name_plural: "Kikärtor",
    category: "Baljväxter",
  },
  {
    name_singular: "Lins",
    name_plural: "Linser",
    category: "Baljväxter",
  },
  {
    name_singular: "Svart böna",
    name_plural: "Svarta bönor",
    category: "Baljväxter",
  },

  // =====================
  // KONSERVER
  // =====================

  {
    name_singular: "Krossad tomat",
    name_plural: "Krossade tomater",
    category: "Konserver",
  },
  {
    name_singular: "Kokosmjölk",
    name_plural: "Kokosmjölk",
    category: "Konserver",
  },
  {
    name_singular: "Tonfisk på burk",
    name_plural: "Tonfiskburkar",
    category: "Konserver",
  },

  // =====================
  // FRYSTA VAROR
  // =====================

  {
    name_singular: "Fryst ärta",
    name_plural: "Frysta ärtor",
    category: "Frysta varor",
  },
  {
    name_singular: "Fryst bär",
    name_plural: "Frysta bär",
    category: "Frysta varor",
  },

  // =====================
  // NÖTTER & FRÖN
  // =====================

  {
    name_singular: "Mandel",
    name_plural: "Mandler",
    category: "Nötter & frön",
  },
  {
    name_singular: "Valnöt",
    name_plural: "Valnötter",
    category: "Nötter & frön",
  },
  {
    name_singular: "Chiafrö",
    name_plural: "Chiafrön",
    category: "Nötter & frön",
  },
  {
    name_singular: "Solrosfrö",
    name_plural: "Solrosfrön",
    category: "Nötter & frön",
  },

  // =====================
  // OLJOR & FETTER
  // =====================

  {
    name_singular: "Olivolja",
    name_plural: "Olivoljor",
    category: "Oljor & fetter",
  },
  {
    name_singular: "Rapsolja",
    name_plural: "Rapsoljor",
    category: "Oljor & fetter",
  },
  {
    name_singular: "Sesamolja",
    name_plural: "Sesamoljor",
    category: "Oljor & fetter",
  },

  // =====================
  // SÅSER & DRESSINGAR
  // =====================

  {
    name_singular: "Soja",
    name_plural: "Soja",
    category: "Såser & dressingar",
  },
  {
    name_singular: "Ketchup",
    name_plural: "Ketchup",
    category: "Såser & dressingar",
  },
  {
    name_singular: "Majonnäs",
    name_plural: "Majonnäs",
    category: "Såser & dressingar",
  },
  {
    name_singular: "Pesto",
    name_plural: "Pesto",
    category: "Såser & dressingar",
  },

  // =====================
  // BULJONG & FOND
  // =====================

  {
    name_singular: "Kycklingbuljong",
    name_plural: "Kycklingbuljong",
    category: "Buljong & fond",
  },
  {
    name_singular: "Grönsaksfond",
    name_plural: "Grönsaksfonder",
    category: "Buljong & fond",
  },

  // =====================
  // SÖTNINGSMEDEL
  // =====================

  {
    name_singular: "Socker",
    name_plural: "Socker",
    category: "Sötningsmedel",
  },
  {
    name_singular: "Honung",
    name_plural: "Honung",
    category: "Sötningsmedel",
  },
  {
    name_singular: "Sirap",
    name_plural: "Sirap",
    category: "Sötningsmedel",
  },

  // =====================
  // DRYCKER
  // =====================

  {
    name_singular: "Kaffe",
    name_plural: "Kaffe",
    category: "Drycker",
  },
  {
    name_singular: "Te",
    name_plural: "Te",
    category: "Drycker",
  },
  {
    name_singular: "Juice",
    name_plural: "Juicer",
    category: "Drycker",
  },

  // =====================
  // VEGETARISKT & VEGANSKT
  // =====================

  {
    name_singular: "Tofu",
    name_plural: "Tofu",
    category: "Vegetariskt & veganskt",
  },
  {
    name_singular: "Tempeh",
    name_plural: "Tempeh",
    category: "Vegetariskt & veganskt",
  },
  {
    name_singular: "Vegofärs",
    name_plural: "Vegofärser",
    category: "Vegetariskt & veganskt",
  },

  // =====================
  // GLUTENFRITT
  // =====================

  {
    name_singular: "Glutenfri pasta",
    name_plural: "Glutenfria pastor",
    category: "Glutenfritt",
  },
  {
    name_singular: "Mandelmjöl",
    name_plural: "Mandelmjöl",
    category: "Glutenfritt",
  },

  // =====================
  // SNACKS & TILLBEHÖR
  // =====================

  {
    name_singular: "Chips",
    name_plural: "Chips",
    category: "Snacks & tillbehör",
  },
  {
    name_singular: "Krutong",
    name_plural: "Krutonger",
    category: "Snacks & tillbehör",
  },
  {
    name_singular: "Tacoskal",
    name_plural: "Tacoskal",
    category: "Snacks & tillbehör",
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

const recipeCategoriesData = [
  { name: "Bak & dessert", slug: "bak-dessert", image: "bak-dessert.jpg" },
  { name: "Dryck", slug: "dryck", image: "dryck.jpg" },
  { name: "Kött", slug: "kott", image: "kott.jpg" },
  { name: "Kyckling", slug: "kyckling", image: "kyckling.jpg" },
  { name: "Fisk", slug: "fisk", image: "fisk.jpg" },
  { name: "Skaldjur", slug: "skaldjur", image: "skaldjur.jpg" },
  { name: "Vegetariskt", slug: "vegetariskt", image: "vegetariskt.jpg" },
  { name: "Veganskt", slug: "veganskt", image: "veganskt.jpg" },
];

async function uploadImage(strapi, fileName) {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "recipeCategoryImages",
    fileName,
  );

  if (!fs.existsSync(filePath)) {
    console.log(`Bild saknas: ${fileName}`);
    return null;
  }

  const fileStat = fs.statSync(filePath);

  const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
    data: {},
    files: {
      filepath: filePath,
      path: filePath,
      name: fileName,
      type: "image/jpeg",
      mimetype: "image/jpeg",
      size: fileStat.size,
    },
  });

  return uploadedFiles[0];
}

// =====================
// Seed function
// =====================

async function seed(strapi) {
  console.log("Startar seed...");

  const categoryMap = {};
  const ingredientMap = {};
  const recipeCategoryMap = {};

  // =====================
  // CATEGORIES
  // =====================

  for (const categoryName of categoriesData) {
    const existingCategory = await strapi.entityService.findMany(
      "api::ingredient-category.ingredient-category",
      {
        filters: {
          name: categoryName,
        },
      },
    );

    let categoryId;

    if (existingCategory.length > 0) {
      categoryId = existingCategory[0].id;

      console.log(`Kategori finns redan: ${categoryName}`);
    } else {
      const createdCategory = await strapi.entityService.create(
        "api::ingredient-category.ingredient-category",
        {
          data: {
            name: categoryName,

            slug: categoryName
              .toLowerCase()
              .replace(/å/g, "a")
              .replace(/ä/g, "a")
              .replace(/ö/g, "o")
              .replace(/\s+/g, "-")
              .replace(/&/g, "och"),

            publishedAt: new Date(),
          },
        },
      );

      categoryId = createdCategory.id;

      console.log(`Kategori skapad: ${categoryName}`);
    }

    categoryMap[categoryName] = categoryId;
  }

  // =====================
  // RECIPE CATEGORIES
  // =====================

  for (const category of recipeCategoriesData) {
    const existingCategory = await strapi.entityService.findMany(
      "api::recipe-category.recipe-category",
      {
        filters: {
          $or: [{ slug: category.slug }, { name: category.name }],
        },
      },
    );

    let categoryId;

    if (existingCategory.length > 0) {
      categoryId = existingCategory[0].id;

      console.log(`Receptkategori finns redan: ${category.name}`);
    } else {
      const uploadedImage = await uploadImage(strapi, category.image);

      const createdCategory = await strapi.entityService.create(
        "api::recipe-category.recipe-category",
        {
          data: {
            name: category.name,
            slug: category.slug,
            image: uploadedImage?.id || null,
            publishedAt: new Date(),
          },
        },
      );

      categoryId = createdCategory.id;

      console.log(`Receptkategori skapad: ${category.name}`);
    }

    recipeCategoryMap[category.name] = categoryId;
  }

  // =====================
  // INGREDIENTS
  // =====================

  for (const ingredient of ingredientsData) {
    const existingIngredients = await strapi.entityService.findMany(
      "api::ingredient.ingredient",
      {
        filters: {
          name_singular: ingredient.name_singular,
        },
      },
    );

    let ingredientId;

    if (existingIngredients.length > 0) {
      ingredientId = existingIngredients[0].id;

      console.log(`Ingrediens finns redan: ${ingredient.name_singular}`);
    } else {
      const createdIngredient = await strapi.entityService.create(
        "api::ingredient.ingredient",
        {
          data: {
            ...ingredient,

            slug: ingredient.name_singular
              .toLowerCase()
              .replace(/å/g, "a")
              .replace(/ä/g, "a")
              .replace(/ö/g, "o")
              .replace(/\s+/g, "-"),

            ingredient_category: categoryMap[ingredient.category],

            publishedAt: new Date(),
          },
        },
      );

      ingredientId = createdIngredient.id;

      console.log(`Ingrediens skapad: ${ingredient.name_singular}`);
    }

    ingredientMap[ingredient.name_singular] = ingredientId;
  }

  // =====================
  // RECIPES
  // =====================

  for (const recipe of recipesData) {
    const formattedIngredients = recipe.ingredients.map((item) => ({
      amount: item.amount,
      unit: item.unit,
      note: "",

      ingredient: ingredientMap[item.ingredient],
    }));

    const existingRecipe = await strapi.entityService.findMany(
      "api::recipe.recipe",
      {
        filters: {
          title: recipe.title,
        },
      },
    );

    if (existingRecipe.length > 0) {
      console.log(`Recept finns redan: ${recipe.title}`);

      continue;
    }

    await strapi.entityService.create("api::recipe.recipe", {
      data: {
        title: recipe.title,
        description: recipe.description,

        cooking_time_minutes: recipe.cooking_time_minutes,

        instructions: recipe.instructions,

        ingredients: formattedIngredients,

        publishedAt: new Date(),
      },
    });

    console.log(`Recept skapat: ${recipe.title}`);
  }

  console.log("Seed klar!");
}

module.exports = seed;
