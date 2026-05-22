import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function useFavoriteToggle() {
  const { user, updateUser, isLoggedIn } = useAuth();
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  async function toggleFavorite(e, recipe) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isLoggedIn) {
      setIsGuestModalOpen(true);
      return;
    }

    const recipeId = recipe.documentId || recipe.id;
    const currentFavorites = user?.favorites || [];
    const isFavorite = currentFavorites.some(
      (fav) => fav.documentId === recipeId || fav.id === recipeId
    );

    let newFavorites;
    if (isFavorite) {
      newFavorites = currentFavorites.filter(
        (fav) => fav.documentId !== recipeId && fav.id !== recipeId
      );
    } else {
      newFavorites = [...currentFavorites, recipe];
    }

    const favoriteIds = newFavorites.map((f) => f.documentId);

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:1337/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ favorites: favoriteIds }),
      });

      if (response.ok) {
        updateUser({ ...user, favorites: newFavorites });
        
        const resPop = await fetch("http://localhost:1337/api/users/me?populate[profilePic]=true&populate[favorites]=true", {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        if(resPop.ok) {
          updateUser(await resPop.json());
        }
      } else {
        alert("Kunde inte spara favoriten.");
      }
    } catch (err) {
      console.error(err);
      alert("Ett fel uppstod.");
    }
  }

  const checkIfFavorite = (recipe) => {
    const currentFavorites = user?.favorites || [];
    const recipeId = recipe?.documentId || recipe?.id;
    if (!recipeId) return false;
    return currentFavorites.some(
      (fav) => fav.documentId === recipeId || fav.id === recipeId
    );
  };

  return {
    toggleFavorite,
    isGuestModalOpen,
    setIsGuestModalOpen,
    userFavorites: user?.favorites || [],
    checkIfFavorite
  };
}
