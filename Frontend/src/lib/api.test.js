import { describe, expect, it } from "vitest";
import { getImageUrl } from "./api";

describe("getImageUrl", () => {
  it("returnerar placeholder om ingen bild finns", () => {
    expect(getImageUrl(null)).toBe("/placeholder-recipe.jpg");
  });

  it("bygger full Strapi-url för relativ bild-url", () => {
    const image = {
      url: "/uploads/pasta.jpg",
    };

    expect(getImageUrl(image)).toBe(
      `${import.meta.env.VITE_API_URL}/uploads/pasta.jpg`,
    );
  });

  it("returnerar absolut url utan att ändra den", () => {
    const image = {
      url: "https://example.com/image.jpg",
    };

    expect(getImageUrl(image)).toBe("https://example.com/image.jpg");
  });
});
