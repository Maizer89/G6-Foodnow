import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337"

export function useMyRecept() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCookingTime, setEditCookingTime] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editIngredients, setEditIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchMyRecipes() {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Du måste vara inloggad.");

      const res = await fetch(
        `${API_URL}/api/users/me?populate[recipes][populate][image]=true&populate[recipes][populate][ingredients][populate]=ingredient`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Kunde inte hämta dina recept.");
      const data = await res.json();
      const recipes = Array.isArray(data.recipes) ? data.recipes : [];
      setRecipes(recipes);

      if (allIngredients.length === 0) {
        const ingRes = await fetch(`${API_URL}/api/ingredients`);
        if (ingRes.ok) {
          const ingData = await ingRes.json();
          setAllIngredients(ingData.data || []);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  function openEdit(recipe) {
    setEditingRecipe(recipe);
    setEditTitle(recipe.title ?? "");
    setEditDescription(recipe.description ?? "");
    setEditCookingTime(String(recipe.cooking_time_minutes ?? ""));
    const instr = recipe.instructions;
    if (Array.isArray(instr)) {
      const text = instr
        .flatMap((block) => block.children ?? [])
        .map((c) => c.text ?? "")
        .join("\n");
      setEditInstructions(text);
    } else {
      setEditInstructions(instr ?? "");
    }
    setEditError(null);
    setEditSuccess(false);
    setEditImageFile(null);
    setEditImagePreview(null);
    setRemoveImage(false);
    setEditIngredients(
      recipe.ingredients
        ? recipe.ingredients.map(i => i.ingredient?.documentId || i.ingredient?.id).filter(Boolean)
        : []
    );
  }

  function closeEdit() {
    setEditingRecipe(null);
    setEditError(null);
    setEditSuccess(false);
    setEditImageFile(null);
    setEditImagePreview(null);
    setRemoveImage(false);
    setEditIngredients([]);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(false);
    setIsSaving(true);

    const token = localStorage.getItem("jwt");
    if (!token) {
      setEditError("Du måste vara inloggad.");
      setIsSaving(false);
      return;
    }

    const title = editTitle.trim();
    const description = editDescription.trim();
    const instructions = editInstructions.trim();
    const cookingTime = Number.parseInt(editCookingTime, 10);

    if (!title) { setEditError("Titeln får inte vara tom."); setIsSaving(false); return; }
    if (!description) { setEditError("Beskrivningen får inte vara tom."); setIsSaving(false); return; }
    if (!Number.isInteger(cookingTime) || cookingTime <= 0) {
      setEditError("Tillagningstid måste vara ett heltal större än 0.");
      setIsSaving(false);
      return;
    }

    try {
      const docId = editingRecipe.documentId ?? editingRecipe.id;
      let uploadedImageId = null;

      if (editImageFile) {
        const formData = new FormData();
        formData.append("files", editImageFile);

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Bilden kunde inte laddas upp.");

        const uploadData = await uploadRes.json();
        if (uploadData && uploadData.length > 0) {
          uploadedImageId = uploadData[0].id;
        }
      }

      const patchBody = {
        data: {
          title,
          description,
          cooking_time_minutes: cookingTime,
          instructions: [
            { type: "paragraph", children: [{ type: "text", text: instructions }] },
          ],
          ingredients: editIngredients.map(id => ({ ingredient: id })),
        },
      };

      if (uploadedImageId) {
        patchBody.data.image = uploadedImageId;
      } else if (removeImage) {
        patchBody.data.image = null;
      }

      const res = await fetch(`${API_URL}/api/recipes/${docId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message ?? "Kunde inte spara ändringarna.");
      }

      setEditSuccess(true);
      await fetchMyRecipes();
      setTimeout(closeEdit, 1200);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(recipe) {
    const token = localStorage.getItem("jwt");
    if (!token) { setError("Du måste vara inloggad."); return; }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/recipes/${recipe.documentId ?? recipe.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Kunde inte ta bort receptet.");
      setDeletingId(null);
      await fetchMyRecipes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
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
  };
}
