import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const API_URL = "http://localhost:1337";

Categories.route = {
  path: "/categories",
  label: "Kategorier",
  index: 2,
};

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(`${API_URL}/api/recipe-categories?populate=*`);
      const json = await res.json();

      setCategories(json.data || []);
    }

    fetchCategories();
  }, []);

  return (
    <div>
      <PageHeader
        title="Kategorier"
        subtitle="Välj en kategori för att se matchande recept."
      />

      <div className="category-grid">
        {categories.map((category) => {
          const imageUrl = category.image?.url
            ? `${API_URL}${category.image.url}`
            : "/placeholder-category.jpg";

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
