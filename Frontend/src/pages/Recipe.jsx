import { useEffect, useState } from "react";
import IngredientFilter from "../components/IngredientFilter";
import GuestFavoriteModal from "../components/GuestFavoriteModal";
import { useFavoriteToggle } from "../hooks/useFavoriteToggle";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../services/apiService";

Recept.route = {
  path: "/",
  label: "Recept",
  index: 1,
};

function Recept() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const {
    toggleFavorite,
    isGuestModalOpen,
    setIsGuestModalOpen,
    checkIfFavorite,
  } = useFavoriteToggle();

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const json = await getRecipes();
        setRecipes(json.data || []);
      } catch (error) {
        console.error("Kunde inte hämta recept:", error);
      }
    }

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    // Filtrera på titel
    const matchesSearch = recipe.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    // Om inga ingredients är valda
    // visa alla recept
    if (selectedIngredients.length === 0) {
      return matchesSearch;
    }

    // Hämta ingredient names från receptet
    const recipeIngredientNames = recipe.ingredients.map(
      (item) => item.ingredient?.name_singular,
    );

    // Kontrollera om receptet innehåller
    // alla valda ingredients
    const matchesIngredients = selectedIngredients.every((selectedIngredient) =>
      recipeIngredientNames.includes(selectedIngredient),
    );

    return matchesSearch && matchesIngredients;
  });

  return (
    <div>
      <PageHeader
        title="Vad vill du laga?"
        subtitle="Lägg till ingredienser och hitta recept snabbt."
      />

      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="Sök recept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn" type="button">
          +
        </button>
      </div>

      <IngredientFilter
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />

      <div className="recipe-count">
        {filteredRecipes.length} recept hittades
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.documentId || recipe.id}
            recipe={recipe}
            showFavorite
            isFavorite={checkIfFavorite(recipe)}
            onFavoriteClick={toggleFavorite}
          />
        ))}
      </div>

      <GuestFavoriteModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}

export default Recept;
