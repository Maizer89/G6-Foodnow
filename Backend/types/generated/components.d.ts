import type { Schema, Struct } from '@strapi/strapi';

export interface RecipeRecipeIngredient extends Struct.ComponentSchema {
  collectionName: 'components_recipe_recipe_ingredients';
  info: {
    displayName: 'Recipe Ingredient';
    icon: 'restaurant';
  };
  attributes: {
    amount: Schema.Attribute.String;
    ingredient: Schema.Attribute.Relation<
      'oneToOne',
      'api::ingredient.ingredient'
    >;
    note: Schema.Attribute.String;
    unit: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'recipe.recipe-ingredient': RecipeRecipeIngredient;
    }
  }
}
