import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:1337";
const PAGE_SIZE = 20;

CategoryRecipes.route = {
  path: "/category/:slug",
  hidden: true,
};

function CategoryRecipes() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [categoryName, setCategoryName] = useState(slug);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRecipes([]);
    setPage(1);
  }, [slug]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/recipes?populate=*&filters[recipe_category][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
        );

        const json = await res.json();

        const categoryRes = await fetch(
          `${API_URL}/api/recipe-categories?filters[slug][$eq]=${slug}`,
        );

        const categoryJson = await categoryRes.json();

        if (categoryJson.data?.[0]?.name) {
          setCategoryName(categoryJson.data[0].name);
        }

        setRecipes((prev) =>
          page === 1 ? json.data || [] : [...prev, ...(json.data || [])],
        );

        setPageCount(json.meta?.pagination?.pageCount || 1);
      } catch (error) {
        console.error("Kunde inte hämta kategorirecept:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [slug, page]);

  return (
    <main className="main">
      <button className="primary-btn" onClick={() => navigate(-1)}>
        ← Tillbaka
      </button>

      <div className="page-header" style={{ marginTop: "24px" }}>
        <h1 className="page-title">{categoryName}</h1>
        <p className="page-subtitle">Recept i kategorin {categoryName}.</p>
      </div>

      <div className="recipe-count">{recipes.length} recept hittades</div>

      <div className="recipe-grid">
        {recipes.map((recipe) => {
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

      {page < pageCount && (
        <button
          className="primary-btn"
          style={{ marginTop: "32px" }}
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {loading ? "Laddar..." : "Hämta fler"}
        </button>
      )}
    </main>
  );
}

export default CategoryRecipes;
