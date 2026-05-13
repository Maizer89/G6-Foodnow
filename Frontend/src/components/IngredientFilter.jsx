import { useEffect, useMemo, useState } from "react";

export default function IngredientFilter() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [search, setSearch] = useState("");

  // Hämta ingredients från Strapi
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch(
          "http://localhost:1337/api/ingredients"
        );

        const data = await response.json();

        setIngredients(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchIngredients();
  }, []);

  // Filtrera medan användaren skriver
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ingredient) =>
      ingredient.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [ingredients, search]);

  // Lägg till / ta bort ingredient
  function toggleIngredient(name) {
    setSelectedIngredients((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  }

  return (
    <>
      {/* Search */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Lägg till ingrediens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn">+</button>
      </div>

      {/* Ingredient list */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "20px",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        {filteredIngredients.map((ingredient) => (
          <label
            key={ingredient.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 0",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={selectedIngredients.includes(
                ingredient.name
              )}
              onChange={() =>
                toggleIngredient(ingredient.name)
              }
            />

            {ingredient.name}
          </label>
        ))}
      </div>

      {/* Selected ingredients */}
      <div className="ingredients">
        {selectedIngredients.map((ingredient) => (
          <div className="chip" key={ingredient}>
            {ingredient}

            <button
              onClick={() =>
                toggleIngredient(ingredient)
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}