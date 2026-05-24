import { Link } from "react-router-dom";
import { getImageUrl } from "../lib/api";

export default function RecipeCard({
  recipe,
  showFavorite = false,
  isFavorite = false,
  onFavoriteClick,
}) {
  const imageUrl = getImageUrl(recipe.image);

  return (
    <Link
      to={`/recipes/${recipe.documentId || recipe.id}`}
      className="recipe-card"
    >
      <img src={imageUrl} alt={recipe.title} />

      {showFavorite && (
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          type="button"
          onClick={(e) => onFavoriteClick?.(e, recipe)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      )}

      <div className="recipe-content">
        <h2 className="recipe-title">{recipe.title}</h2>

        <div className="recipe-meta">
          <span>{recipe.cooking_time_minutes} min</span>

          <span>{recipe.ingredients?.length || 0} ingredienser</span>
        </div>
      </div>
    </Link>
  );
}
