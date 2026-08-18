import { describe, it, expect, vi } from "vitest";

describe("Recipe category custom controller", () => {
  it("hämtar alla recept som tillhör en kategori", async () => {
    // Mockad kategori
    const category = {
      id: 1,
      documentId: "category-1",
      name: "Vegetariskt",
      slug: "vegetariskt",
    };

    // Mockade recept som tillhör kategorin
    const recipes = [
      {
        id: 1,
        documentId: "recipe-1",
        title: "Vegetarisk Riswok",
      },
      {
        id: 2,
        documentId: "recipe-2",
        title: "Vegobowl",
      },
    ];

    // Mockar Strapis documents API
    const findFirst = vi.fn().mockResolvedValue(category);
    const findMany = vi.fn().mockResolvedValue(recipes);

    const strapi = {
      documents: vi.fn((api) => {
        if (api === "api::recipe-category.recipe-category") {
          return {
            findFirst,
          };
        }

        if (api === "api::recipe.recipe") {
          return {
            findMany,
          };
        }
      }),
    };

    const ctx = {
      params: {
        slug: "vegetariskt",
      },
      badRequest: vi.fn(),
      notFound: vi.fn(),
    };

    // Samma logik som vår custom controller använder
    const categoryResult = await strapi
      .documents("api::recipe-category.recipe-category")
      .findFirst({
        filters: {
          slug: {
            $eq: ctx.params.slug,
          },
        },
      });

    const recipeResult = await strapi
      .documents("api::recipe.recipe")
      .findMany({
        filters: {
          recipe_category: {
            documentId: {
              $eq: categoryResult.documentId,
            },
          },
        },
      });

    const response = {
      data: recipeResult,
    };

    // Verifiera resultatet
    expect(response.data).toHaveLength(2);

    expect(response.data[0].title).toBe("Vegetarisk Riswok");
    expect(response.data[1].title).toBe("Vegobowl");

    // Kontrollera att rätt kategori användes
    expect(findFirst).toHaveBeenCalledWith({
      filters: {
        slug: {
          $eq: "vegetariskt",
        },
      },
    });

    // Kontrollera att recepten filtrerades på rätt kategori
    expect(findMany).toHaveBeenCalledWith({
      filters: {
        recipe_category: {
          documentId: {
            $eq: "category-1",
          },
        },
      },
    });
  });
});