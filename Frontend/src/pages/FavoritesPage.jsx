import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

FavoritesPage.route = {
  path: "/favorites",
  label: "Favoriter",
  authOnly: true,
};

const API_URL = "http://localhost:1337";

export default function FavoritesPage() {
  const { user, updateUser } = useAuth();
  const [fullFavorites, setFullFavorites] = useState([]);

  const favorites = user?.favorites || [];

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setFullFavorites([]);
        return;
      }

      const qs = favorites
        .filter((f) => f.documentId)
        .map((f, i) => `filters[documentId][$in][${i}]=${f.documentId}`)
        .join("&");

      if (!qs) return;

      try {
        const res = await fetch(`${API_URL}/api/recipes?${qs}&populate=image`);
        if (res.ok) {
          const json = await res.json();
          setFullFavorites(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch favorite recipes:", err);
      }
    }

    fetchFavorites();
  }, [favorites]);

  async function handleRemoveFavorite(e, recipeId) {
    e.preventDefault();
    e.stopPropagation();

    const newFavorites = favorites.filter(
      (fav) => fav.documentId !== recipeId && fav.id !== recipeId,
    );
    const favoriteIds = newFavorites.map((f) => f.documentId);

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ favorites: favoriteIds }),
      });

      if (response.ok) {
        updateUser({ ...user, favorites: newFavorites });
        const resPop = await fetch(
          `${API_URL}/api/users/me?populate[profilePic]=true&populate[favorites]=true`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          },
        );
        if (resPop.ok) {
          updateUser(await resPop.json());
        }
      } else {
        alert("Kunde inte ta bort favoriten.");
      }
    } catch (err) {
      console.error(err);
      alert("Ett fel uppstod.");
    }
  }

  return (
    <div className="favorites-layout">
      <div className="page-header">
        <h1 className="page-title">Mina Favoriter</h1>
        <p className="page-subtitle">Dina sparade favoritrecept.</p>
      </div>

      {fullFavorites.length === 0 ? (
        <p>Du har inga sparade favoriter ännu</p>
      ) : (
        <div className="favorite-list">
          {fullFavorites.map((recipe) => {
            const imageUrl = recipe.image?.url
              ? `${API_URL}${recipe.image.url}`
              : "/placeholder-recipe.jpg";

            return (
              <Link
                key={recipe.documentId || recipe.id}
                to={`/recipes/${recipe.documentId || recipe.id}`}
                className="favorite-item"
              >
                <img src={imageUrl} alt={recipe.title || "Recept"} />
                <div className="favorite-info">
                  <h3>{recipe.title}</h3>
                  {recipe.cooking_time_minutes && (
                    <p>{recipe.cooking_time_minutes} min</p>
                  )}
                </div>
                <button
                  className="remove-favorite-btn"
                  title="Ta bort från favoriter"
                  type="button"
                  onClick={(e) =>
                    handleRemoveFavorite(e, recipe.documentId || recipe.id)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
