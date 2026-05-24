import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";

import {
  getRecipesByCategory,
  getCategoryBySlug,
} from "../services/apiService";

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setRecipes([]);
    setPage(1);
  }, [slug]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError("");

        const json = await getRecipesByCategory(slug, page, PAGE_SIZE);

        const categoryJson = await getCategoryBySlug(slug);

        if (categoryJson.data?.[0]?.name) {
          setCategoryName(categoryJson.data[0].name);
        }

        setRecipes((prev) =>
          page === 1 ? json.data || [] : [...prev, ...(json.data || [])],
        );

        setPageCount(json.meta?.pagination?.pageCount || 1);
      } catch {
        setError("Kunde inte hämta kategorirecept.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [slug, page]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading && page === 1) {
    return <div className="main">Laddar recept...</div>;
  }

  return (
    <div>
      <Button className="back-btn" onClick={() => navigate(-1)}>
        ← Tillbaka
      </Button>

      <PageHeader
        title={categoryName}
        subtitle={`Recept i kategorin ${categoryName}.`}
      />

      <div className="recipe-count">{recipes.length} recept hittades</div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.documentId || recipe.id} recipe={recipe} />
        ))}
      </div>

      {page < pageCount && (
        <Button
          className="load-more-btn"
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {loading ? "Laddar..." : "Hämta fler"}
        </Button>
      )}
    </div>
  );
}

export default CategoryRecipes;
