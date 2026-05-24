import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { getImageUrl } from "../lib/api";
import { getRecipeCategories } from "../services/apiService";

Categories.route = {
  path: "/categories",
  label: "Kategorier",
  index: 2,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);

        const json = await getRecipeCategories();
        setCategories(json.data || []);
      } catch {
        setError("Kunde inte hämta kategorier.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div>Laddar kategorier...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Kategorier"
        subtitle="Välj en kategori för att se matchande recept."
      />

      <div className="category-grid">
        {categories.map((category) => {
          const imageUrl = getImageUrl(
            category.image,
            "/placeholder-category.jpg",
          );

          return (
            <Link
              key={category.documentId || category.id}
              to={`/category/${category.slug}`}
              className="category-card"
            >
              <img src={imageUrl} alt={category.name} />
              <h3>{category.name}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
