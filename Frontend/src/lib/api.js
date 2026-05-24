export const API_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(image, fallback = "/placeholder-recipe.jpg") {
  if (!image?.url) return fallback;

  return image.url.startsWith("http") ? image.url : `${API_URL}${image.url}`;
}
