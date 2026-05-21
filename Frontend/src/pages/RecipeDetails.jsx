import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:1337";

RecipeDetail.route = {
  path: "/recipes/:id",
  hidden: true,
};

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipe() {
      const res = await fetch(
        `${API_URL}/api/recipes/${id}?populate[image]=true&populate[recipe_category]=true&populate[ingredients][populate][ingredient]=true`,
      );

      const json = await res.json();
      setRecipe(json.data);
    }

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <main className="main">Laddar recept...</main>;
  }

  const imageUrl = recipe.image?.url
    ? `${API_URL}${recipe.image.url}`
    : "/placeholder-recipe.jpg";

  return (
    <main className="main">
      <button
        className="primary-btn"
        style={{ marginBottom: "10px" }}
        onClick={() => navigate(-1)}
      >
        ← Tillbaka
      </button>
      <div className="recipe-detail">
        <img
          className="recipe-detail-image"
          src={imageUrl}
          alt={recipe.title}
        />

        <div className="page-header">
          <h1 className="page-title">{recipe.title}</h1>
          <p className="page-subtitle">{recipe.description}</p>
        </div>

        <div className="recipe-meta">
          <span>{recipe.cooking_time_minutes} min</span>
          {recipe.recipe_category && <span>{recipe.recipe_category.name}</span>}
        </div>

        <section className="detail-section">
          <h2>Ingredienser</h2>

          <ul>
            {recipe.ingredients?.map((item) => (
              <li key={item.id}>
                {item.amount} {item.unit}{" "}
                {item.ingredient?.name_singular || "Ingrediens"}
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h2>Instruktioner</h2>

          {recipe.instructions?.map((block, index) => (
            <p key={index}>
              {block.children?.map((child) => child.text).join("")}
            </p>
          ))}
        </section>
      </div>
    </main>
  );
}

export default RecipeDetail;
