import { describe, it, expect } from "vitest";

// Logiken extraherad från useFavoriteToggle.js – testar checkIfFavorite-beteendet
function checkIfFavorite(user, recipe) {
  const currentFavorites = user?.favorites || [];
  const recipeId = recipe?.documentId || recipe?.id;
  if (!recipeId) return false;
  return currentFavorites.some(
    (fav) => fav.documentId === recipeId || fav.id === recipeId
  );
}

describe("checkIfFavorite", () => {
  const favoritedRecipe = { documentId: "abc123", title: "Pasta" };
  const otherRecipe = { documentId: "xyz999", title: "Pizza" };
  const user = { favorites: [favoritedRecipe] };

  it("ska returnera true om receptet finns i favoritlistan (via documentId)", () => {
    expect(checkIfFavorite(user, favoritedRecipe)).toBe(true);
  });

  it("ska returnera false om receptet INTE finns i favoritlistan", () => {
    expect(checkIfFavorite(user, otherRecipe)).toBe(false);
  });

  it("ska returnera false om användaren har en tom favoritlista", () => {
    const emptyUser = { favorites: [] };
    expect(checkIfFavorite(emptyUser, favoritedRecipe)).toBe(false);
  });

  it("ska returnera false om receptet saknar både documentId och id", () => {
    const recipeWithoutId = { title: "Soppa" };
    expect(checkIfFavorite(user, recipeWithoutId)).toBe(false);
  });

  it("ska fungera korrekt med numeriskt id (Strapi v4-format)", () => {
    const userWithNumericId = { favorites: [{ id: 42, title: "Sallad" }] };
    const recipeById = { id: 42, title: "Sallad" };
    expect(checkIfFavorite(userWithNumericId, recipeById)).toBe(true);
  });
});
