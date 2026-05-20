import { useNavigate } from "react-router-dom";
import { useMyRecept } from "../hooks/useMyRecept";
import "../css/MyRecept.css";

MyReceptPage.route = {
    path: "/my-recept",
    label: "Mina Recept",
    hidden: true,
};

function MyReceptPage() {
    const navigate = useNavigate();
    const {
        recipes,
        isLoading,
        error,
        editingRecipe,
        editTitle, setEditTitle,
        editDescription, setEditDescription,
        editCookingTime, setEditCookingTime,
        editInstructions, setEditInstructions,
        editImageFile, setEditImageFile,
        editImagePreview, setEditImagePreview,
        removeImage, setRemoveImage,
        editIngredients, setEditIngredients,
        allIngredients,
        editError,
        editSuccess,
        isSaving,
        deletingId, setDeletingId,
        isDeleting,
        openEdit,
        closeEdit,
        handleSaveEdit,
        handleDelete,
        API_URL,
    } = useMyRecept();

    function getImageUrl(recipe) {
        const img = recipe?.image;
        if (!img) return null;
        const url = img?.url ?? img?.formats?.medium?.url ?? img?.formats?.thumbnail?.url;
        if (!url) return null;
        return url.startsWith("http") ? url : `${API_URL}${url}`;
    }

    function getInstructionsText(recipe) {
        const instr = recipe?.instructions;
        if (!instr) return "";
        if (Array.isArray(instr)) {
            return instr
                .flatMap((block) => block.children ?? [])
                .map((c) => c.text ?? "")
                .join(" ");
        }
        return String(instr);
    }

    return (
        <div className="main my-recept-page">
            <div className="page-header">
                <button
                    className="primary-btn"
                    style={{ marginBottom: "16px" }}
                    onClick={() => navigate(-1)}
                >
                    ← Tillbaka
                </button>
                <h1 className="page-title">Mina Recept</h1>
                <p className="page-subtitle">
                    {isLoading ? "Laddar..." : `${recipes.length} recept`}
                </p>
            </div>

            {error && <p className="mr-error">{error}</p>}

            {!isLoading && recipes.length === 0 && !error && (
                <div className="empty-state">
                    <p style={{ fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>
                        Inga recept ännu
                    </p>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                        Gå till <strong>Skapa Recept</strong> för att lägga till ditt första recept.
                    </p>
                </div>
            )}

            <div className="recipe-grid">
                {recipes.map((recipe) => {
                    const imgUrl = getImageUrl(recipe);
                    const instrText = getInstructionsText(recipe);
                    const recipeId = recipe.documentId ?? recipe.id;

                    return (
                        <div
                            key={recipe.id}
                            className="recipe-card my-recipe-card"
                            onClick={() => navigate(`/recipes/${recipeId}`)}
                            style={{ cursor: "pointer" }}
                        >
                            {imgUrl ? (
                                <img src={imgUrl} alt={recipe.title} />
                            ) : (
                                <div className="mr-no-image">Ingen bild</div>
                            )}

                            <button
                                className="favorite-btn"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                            >
                                ♡
                            </button>

                            <div className="recipe-content">
                                <h2 className="recipe-title">{recipe.title}</h2>

                                <div className="recipe-meta">
                                    {recipe.cooking_time_minutes && (
                                        <span>⏱ {recipe.cooking_time_minutes} min</span>
                                    )}
                                </div>

                                {recipe.description && (
                                    <p className="mr-description">{recipe.description}</p>
                                )}

                                {instrText && (
                                    <p className="mr-instructions-preview">{instrText}</p>
                                )}

                                <div className="mr-card-actions">
                                    <button
                                        className="primary-btn mr-edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEdit(recipe);
                                        }}
                                    >
                                        Redigera
                                    </button>
                                    <button
                                        className="mr-delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingId(recipeId);
                                        }}
                                    >
                                        Ta bort
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {deletingId && (
                <div className="mr-modal-backdrop" onClick={() => !isDeleting && setDeletingId(null)}>
                    <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mr-modal-title">Ta bort recept</h2>
                        <p className="mr-modal-text">
                            Är du säker? Det här går inte att ångra.
                        </p>
                        <div className="mr-modal-actions">
                            <button
                                className="secondary-btn"
                                onClick={() => setDeletingId(null)}
                                disabled={isDeleting}
                            >
                                Avbryt
                            </button>
                            <button
                                className="mr-confirm-delete-btn"
                                disabled={isDeleting}
                                onClick={() => {
                                    const recipe = recipes.find(
                                        (r) => (r.documentId ?? r.id) === deletingId
                                    );
                                    if (recipe) handleDelete(recipe);
                                }}
                            >
                                {isDeleting ? "Tar bort..." : "Ja, ta bort"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingRecipe && (
                <div className="mr-modal-backdrop" onClick={() => !isSaving && closeEdit()}>
                    <div className="mr-modal mr-edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mr-modal-header">
                            <h2 className="mr-modal-title">Redigera recept</h2>
                            <button
                                className="mr-close-btn"
                                onClick={closeEdit}
                                disabled={isSaving}
                            >
                                ✕
                            </button>
                        </div>

                        {editError && <p className="mr-error">{editError}</p>}
                        {editSuccess && (
                            <p className="mr-success">Ändringarna sparades!</p>
                        )}

                        <form className="mr-edit-form" onSubmit={handleSaveEdit}>
                            <label className="mr-label">Titel</label>
                            <input
                                className="search-input"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Titel"
                                required
                            />

                            <label className="mr-label">Tillagningstid (minuter)</label>
                            <input
                                className="search-input"
                                type="number"
                                min="1"
                                step="1"
                                value={editCookingTime}
                                onChange={(e) => setEditCookingTime(e.target.value)}
                                placeholder="Minuter"
                                required
                            />

                            <label className="mr-label">Beskrivning</label>
                            <textarea
                                className="mr-textarea"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Beskrivning"
                                rows={3}
                                required
                            />

                            <label className="mr-label">Instruktioner</label>
                            <textarea
                                className="mr-textarea"
                                value={editInstructions}
                                onChange={(e) => setEditInstructions(e.target.value)}
                                placeholder="Instruktioner"
                                rows={5}
                                required
                            />

                            <label className="mr-label">Ingredienser</label>
                            <div className="ingredient-grid" style={{ marginBottom: "16px", maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px" }}>
                                {allIngredients.map((ingredient) => {
                                    const id = ingredient.documentId ?? ingredient.id;
                                    const name = ingredient.name_singular || ingredient.Name || "Okänd ingrediens";
                                    return (
                                        <label key={id} className="ingredient-item chip" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", margin: "4px", padding: "6px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", fontSize: "13px" }}>
                                            <input
                                                type="checkbox"
                                                checked={editIngredients.includes(id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEditIngredients((prev) => [...prev, id]);
                                                    } else {
                                                        setEditIngredients((prev) => prev.filter((i) => i !== id));
                                                    }
                                                }}
                                            />
                                            {name}
                                        </label>
                                    );
                                })}
                            </div>

                            <label className="mr-label">Bild</label>
                            <div className="mr-image-editor">
                                
                                {editImagePreview ? (
                                    <div className="mr-img-preview-wrap">
                                        <img src={editImagePreview} alt="Förhandsvisning" className="mr-img-preview" />
                                        <button
                                            type="button"
                                            className="mr-img-remove-btn"
                                            onClick={() => {
                                                setEditImageFile(null);
                                                setEditImagePreview(null);
                                            }}
                                        >
                                            Avbryt
                                        </button>
                                    </div>
                                ) : editingRecipe?.image && !removeImage ? (
                                    <div className="mr-img-preview-wrap">
                                        <img
                                            src={getImageUrl(editingRecipe)}
                                            alt="Nuvarande bild"
                                            className="mr-img-preview"
                                        />
                                        <button
                                            type="button"
                                            className="mr-img-remove-btn"
                                            onClick={() => setRemoveImage(true)}
                                        >
                                            Ta bort bild
                                        </button>
                                    </div>
                                ) : removeImage ? (
                                    <div className="mr-img-placeholder">
                                        <span>Ingen bild</span>
                                        <button
                                            type="button"
                                            className="secondary-btn"
                                            style={{ marginTop: 8, fontSize: 13 }}
                                            onClick={() => setRemoveImage(false)}
                                        >
                                            Ångra
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mr-img-placeholder">Ingen bild</div>
                                )}

                                {!editImagePreview && (
                                    <label className="mr-img-upload-btn">
                                        {editingRecipe?.image && !removeImage ? "Byt bild" : "Lägg till bild"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setEditImageFile(file);
                                                setEditImagePreview(URL.createObjectURL(file));
                                                setRemoveImage(false);
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="mr-modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={closeEdit}
                                    disabled={isSaving}
                                >
                                    Avbryt
                                </button>
                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Sparar..." : "Spara ändringar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyReceptPage;