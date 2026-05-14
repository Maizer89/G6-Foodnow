import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337";
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_INSTRUCTIONS_LENGTH = 5000;
const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeText(value) {
  return value.replace(/\u0000/g, "").trim();
}

export function useCreateRecept() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch(`${API_URL}/api/ingredients`);
        if (!response.ok) throw new Error("Kunde inte hämta ingredienser");

        const result = await response.json();
        setIngredientsList(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientId)) {
        return prevSelected.filter((id) => id !== ingredientId);
      } else {
        return [...prevSelected, ingredientId];
      }
    });
  };

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("Du måste vara inloggad för att skapa ett recept.");
      return;
    }

    const normalizedTitle = sanitizeText(title);
    const normalizedDescription = sanitizeText(description);
    const normalizedInstructions = sanitizeText(instructions);
    const parsedCookingTime = Number.parseInt(cookingTime, 10);

    if (!normalizedTitle || normalizedTitle.length > MAX_TITLE_LENGTH) {
      setError(`Titeln måste vara mellan 1 och ${MAX_TITLE_LENGTH} tecken.`);
      return;
    }

    if (
      !normalizedDescription ||
      normalizedDescription.length > MAX_DESCRIPTION_LENGTH
    ) {
      setError(
        `Beskrivningen måste vara mellan 1 och ${MAX_DESCRIPTION_LENGTH} tecken.`,
      );
      return;
    }

    if (
      !normalizedInstructions ||
      normalizedInstructions.length > MAX_INSTRUCTIONS_LENGTH
    ) {
      setError(
        `Instruktionerna måste vara mellan 1 och ${MAX_INSTRUCTIONS_LENGTH} tecken.`,
      );
      return;
    }

    if (!Number.isInteger(parsedCookingTime) || parsedCookingTime <= 0) {
      setError("Tillagningstid måste vara ett heltal större än 0.");
      return;
    }

    if (selectedIngredients.length === 0) {
      setError("Du måste välja minst en ingrediens.");
      return;
    }

    if (selectedIngredients.some((id) => !Number.isInteger(id) || id <= 0)) {
      setError("Ingrediensvalet innehåller ogiltiga värden.");
      return;
    }

    if (images.length > MAX_IMAGE_COUNT) {
      setError(`Du kan bara ladda upp högst ${MAX_IMAGE_COUNT} bilder.`);
      return;
    }

    const invalidFile = images.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.has(file.type) ||
        file.size <= 0 ||
        file.size > MAX_IMAGE_SIZE_BYTES,
    );

    if (invalidFile) {
      setError(
        "Bilder måste vara JPG, PNG, WEBP eller GIF och får inte vara större än 5 MB.",
      );
      return;
    }

    try {
      const checkRes = await fetch(
        `${API_URL}/api/recepts?filters[Title][$eqi]=${encodeURIComponent(normalizedTitle)}`
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.data && checkData.data.length > 0) {
          setError(`Ett recept med titeln "${normalizedTitle}" finns redan.`);
          return;
        }
      }

      const formData = new FormData();

      const storedUser = localStorage.getItem("user");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const dataObj = {
        Title: normalizedTitle,
        Description: normalizedDescription,
        Instructions: [
          {
            type: "paragraph",
            children: [{ type: "text", text: normalizedInstructions }]
          }
        ],
        CookingTime: parsedCookingTime,
        ingredients: selectedIngredients,
        // users_permissions_user kopplas server-side av backend-controllern
      };

      const response = await fetch(`${API_URL}/api/recepts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataObj }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        console.error("Strapi fel create:", errBody);
        throw new Error(errBody?.error?.message ?? "Något gick fel när receptet skulle sparas.");
      }

      const created = await response.json();
      const entryId = created.data?.id;

      if (images && images.length > 0 && entryId) {
        const uploadForm = new FormData();
        uploadForm.append("ref", "api::recept.recept");
        uploadForm.append("refId", String(entryId));
        uploadForm.append("field", "Image");
        uploadForm.append("files", images[0], images[0].name);

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          const errBody = await uploadRes.json().catch(() => ({}));
          console.error("Strapi fel (upload):", errBody);
          // Receptet skapades men bild-uppladdning misslyckades – visa varning men fortsätt
          throw new Error("Receptet sparades men bilden kunde inte laddas upp. Kontrollera behörigheter för uppladdning i Strapi.");
        }
      }


      setSuccess(true);

      setTitle("");
      setDescription("");
      setInstructions("");
      setCookingTime("");
      setImages([]);
      setSelectedIngredients([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    title, setTitle,
    description, setDescription,
    instructions, setInstructions,
    cookingTime, setCookingTime,
    images, setImages,
    fileInputRef,
    ingredientsList,
    selectedIngredients,
    error, setError,
    success,
    isLoading,
    showAllIngredients, setShowAllIngredients,
    imagePreviewUrls,
    handleCheckboxChange,
    handleCreate,
    MAX_IMAGE_COUNT,
    MAX_IMAGE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES
  };
}
