import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyRecept } from "../hooks/useMyRecept";
import ChangePasswordModal from "../components/ChangePasswordModal";

ProfilePage.route = {
  path: "/profile",
  label: "Min Profil",
  authOnly: true,
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { recipes } = useMyRecept();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Bilden är för stor. Max storlek är 5MB.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", user.id.toString());
      formData.append("field", "profilePic");

      const jwt = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Misslyckades att ladda upp bilden till servern.");
      }

      const files = await response.json();
      if (files && files[0]) {
        updateUser({ ...user, profilePic: files[0] });
        setUploadSuccess("Profilbilden har uppdaterats!");
        setTimeout(() => setUploadSuccess(""), 4000);
      } else {
        throw new Error("Inget filsvar mottogs från servern.");
      }
    } catch (err) {
      setUploadError(
        err.message || "Ett fel uppstod vid uppladdning av bilden.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    if (!user?.profilePic) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:1337/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ profilePic: null }),
        },
      );

      if (!response.ok) {
        throw new Error("Misslyckades att ta bort bilden från servern.");
      }

      updateUser({ ...user, profilePic: null });
      setUploadSuccess("Profilbilden har tagits bort!");
      setTimeout(() => setUploadSuccess(""), 4000);
    } catch (err) {
      setUploadError(
        err.message || "Ett fel uppstod vid borttagning av bilden.",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const username = user?.username || "Användare";
  const email = user?.email || "Ingen e-post";
  const profilePicUrl = user?.profilePic?.url;
  const avatarUrl = profilePicUrl
    ? profilePicUrl.startsWith("http")
      ? profilePicUrl
      : `http://localhost:1337${profilePicUrl}`
    : `https://ui-avatars.com/api/?name=${username}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Min profil</h1>
        <p className="page-subtitle">Hantera ditt konto och dina recept.</p>
      </div>

      {uploadError && (
        <div className="alert alert-error" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="alert alert-success" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{uploadSuccess}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden-file-input"
      />

      <div className="profile-card">
        <div className="profile-avatar-container">
          <img className="profile-avatar" src={avatarUrl} alt={username} />
          {uploading && (
            <div className="profile-avatar-overlay">
              <span>Laddar...</span>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h2>{username}</h2>
          <p>{email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <strong>{recipes?.length || 0}</strong>
            <span>Recept</span>
          </div>

          <div className="stat">
            <strong>{user?.favorites?.length || 0}</strong>
            <span>Favoriter</span>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-item">
            <span>Ändra profilbild</span>
            <div className="profile-actions">
              {user?.profilePic && (
                <button
                  className="secondary-btn"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                >
                  Ta bort
                </button>
              )}
              <button
                className="secondary-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Laddar..." : "Ändra"}
              </button>
            </div>
          </div>

          <div className="settings-item">
            <span>Byt lösenord</span>
            <button
              className="secondary-btn"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Ändra
            </button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-item">
            <span>Mina recept</span>
            <button
              className="secondary-btn"
              onClick={() => navigate("/my-recept")}
            >
              Visa
            </button>
          </div>

          <div className="settings-item">
            <span>Skapa recept</span>
            <button
              className="secondary-btn"
              onClick={() => navigate("/create-recept")}
            >
              Skapa
            </button>
          </div>

          <div className="settings-item">
            <span>Logga ut</span>
            <button className="primary-btn" onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;
