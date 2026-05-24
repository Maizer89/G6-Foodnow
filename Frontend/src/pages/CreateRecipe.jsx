import { useNavigate } from "react-router-dom";
import { useCreateRecept } from "../hooks/useCreateRecept";
import "../css/CreateRecept.css";

CreateRecept.route = {
  path: "/create-recept",
  label: "Skapa Recept",
  hidden: true,
  authOnly: true,
};

function CreateRecept() {
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    description,
    setDescription,
    instructions,
    setInstructions,
    cookingTime,
    setCookingTime,
    images,
    setImages,
    fileInputRef,
    ingredientsList,
    selectedIngredients,
    error,
    setError,
    success,
    isLoading,
    showAllIngredients,
    setShowAllIngredients,
    imagePreviewUrls,
    handleCheckboxChange,
    handleCreate,
    MAX_IMAGE_COUNT,
    MAX_IMAGE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES,
  } = useCreateRecept();

  if (isLoading) return <p>Laddar ingredienser...</p>;

  return (
    <div className="create-recept-page">
      <div className="page-header">
        <button
          className="primary-btn"
          style={{ marginBottom: "16px" }}
          onClick={() => navigate(-1)}
        >
          ← Tillbaka
        </button>
        <h1 className="page-title">Skapa Recept</h1>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Receptet publicerades!</p>}

      <form className="create-recept-form" onSubmit={handleCreate}>
        <input
          className="form-input"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="number"
          min="1"
          step="1"
          placeholder="Tillagningstid (minuter)"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          required
        />

        <div className="file-upload-row">
          <label className="file-upload-label">
            Ladda upp bilder (valfritt):
          </label>
          <div className="file-upload-control">
            <input
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const acceptedFiles = files.filter(
                  (file) =>
                    ALLOWED_IMAGE_TYPES.has(file.type) &&
                    file.size > 0 &&
                    file.size <= MAX_IMAGE_SIZE_BYTES,
                );

                if (acceptedFiles.length !== files.length) {
                  setError(
                    "En eller flera filer nekades. Välj bara bilder i JPG, PNG, WEBP eller GIF under 5 MB.",
                  );
                }

                setImages((prev) =>
                  [...prev, ...acceptedFiles].slice(0, MAX_IMAGE_COUNT),
                );
              }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              Välj filer
            </button>
            <span className="file-upload-info">
              {images.length > 0
                ? `${images.length} vald(a)`
                : "Inga filer valda"}
            </span>
          </div>
        </div>

        {images.length > 0 && (
          <div className="image-preview-grid">
            {images.map((file, i) => {
              const url = imagePreviewUrls[i];
              return (
                <div className="image-preview" key={i}>
                  <img src={url} alt={file.name} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <textarea
          className="form-input"
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <textarea
          className="form-input"
          placeholder="Instruktioner"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />

        <div className="ingredient-section">
          <h3 className="section-title">Välj Ingredienser:</h3>
          <div className="ingredient-grid">
            {(showAllIngredients
              ? ingredientsList
              : ingredientsList.slice(0, 8)
            ).map((ingredient, idx) => {
              const name =
                ingredient?.name_singular ??
                ingredient?.attributes?.name_singular ??
                ingredient?.Name ??
                ingredient?.attributes?.Name ??
                "Okänd ingrediens";
              const id = ingredient?.documentId ?? ingredient?.id ?? idx;

              return (
                <label key={id} className="ingredient-item chip">
                  <input
                    type="checkbox"
                    value={id}
                    checked={selectedIngredients.includes(id)}
                    onChange={() => handleCheckboxChange(id)}
                  />
                  {name}
                </label>
              );
            })}
          </div>
          {ingredientsList.length > 8 && (
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                className="show-more-btn"
                onClick={() => setShowAllIngredients((s) => !s)}
              >
                {showAllIngredients
                  ? "Visa mindre"
                  : `Visa mer (${ingredientsList.length - 8})`}
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="primary-btn">
          Publicera Recept
        </button>
      </form>
    </div>
  );
}

export default CreateRecept;
