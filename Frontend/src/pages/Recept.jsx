import IngredientFilter from "../components/IngredientFilter";

Recept.route = {
  path: '/',
  label: 'Recept',
  index: 0,
}

export default function Recept() {
  return (
    <main>
      <div className="page-header">
        <h1 className="page-title">
          Vad vill du laga?
        </h1>

        <p className="page-subtitle">
          Lägg till ingredienser du har hemma.
        </p>
      </div>

      <IngredientFilter />
    </main>
  );
}