import { API_URL } from "../lib/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Något gick fel.");
  }

  return json;
}

export function getRecipes() {
  return request(
    "/api/recipes?populate[image]=true&populate[recipe_category]=true&populate[ingredients][populate][ingredient]=true",
  );
}

export function getRecipeById(id) {
  return request(
    `/api/recipes/${id}?populate[image]=true&populate[recipe_category]=true&populate[ingredients][populate][ingredient]=true`,
  );
}

export function getRecipeCategories() {
  return request("/api/recipe-categories?populate=*");
}

export function getIngredients() {
  return request("/api/ingredients?populate=ingredient_category");
}

export function getRecipesByCategory(slug, page = 1, pageSize = 20) {
  return request(
    `/api/recipes?populate=*&filters[recipe_category][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
  );
}

export function getCategoryBySlug(slug) {
  return request(`/api/recipe-categories?filters[slug][$eq]=${slug}`);
}

export function getIngredientCategoriesWithIngredients() {
  return request("/api/ingredient-categories/with-ingredients");
}
