import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { API_URL } from "../lib/api";

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
