import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:1337";

function Recept() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(
          `${API_URL}/api/recipes?populate[image]=true&populate[recipe_category]=true&populate[ingredients][populate][ingredient]=true`,
        );

        const json = await res.json();
        console.log("Strapi recipes:", json);

        setRecipes(json.data || []);
      } catch (error) {
        console.error("Kunde inte hämta recept:", error);
      }
    }

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="main">
      <div className="page-header">
        <h1 className="page-title">Vad vill du laga?</h1>
        <p className="page-subtitle">
          Lägg till ingredienser och hitta recept snabbt.
        </p>
      </div>

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

      <div className="filters">
        <div className="filter-group">
          <button className="filter-btn">Snabbt</button>
          <button className="filter-btn">Pasta</button>
          <button className="filter-btn">Kött</button>
          <button className="filter-btn">Kyckling</button>
          <button className="filter-btn">Vegetariskt</button>
        </div>

        <button className="sort-btn">Mest relevanta</button>
      </div>

      <div className="recipe-count">
        {filteredRecipes.length} recept hittades
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => {
          const imageUrl = recipe.image?.url
            ? `${API_URL}${recipe.image.url}`
            : "/placeholder-recipe.jpg";

          return (
            <Link
              key={recipe.documentId || recipe.id}
              to={`/recipes/${recipe.documentId || recipe.id}`}
              className="recipe-card"
            >
              <img src={imageUrl} alt={recipe.title} />

              <button className="favorite-btn" type="button">
                ♡
              </button>

              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.title}</h2>

                <div className="recipe-meta">
                  <span>{recipe.cooking_time_minutes} min</span>
                  <span>{recipe.ingredients?.length || 0} ingredienser</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

Recept.route = {
  path: "/",
  label: "Recept",
  index: 1,
};

export default Recept;
