import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

ProfilePage.route = {
  path: "/profile",
  label: "Min Profil",
  authOnly: true,
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const username = user?.username || "Användare";
  const email = user?.email || "Ingen e-post";
  const avatarUrl =
    user?.avatar?.url || `https://ui-avatars.com/api/?name=${username}`;

  return (
    <main classname="main">
      <div className="page-header">
        <h1 className="page-title">Min profil</h1>
        <p className="page-subtitle">Hantera ditt konto och dina recept.</p>
      </div>

      <div className="profile-card">
        <img className="profile-avatar" src={avatarUrl} alt={username} />

        <div className="profile-info">
          <h2>{username}</h2>
          <p>{email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <strong>{user?.recipes?.length || 0}</strong>
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
            <button className="secondary-btn">Ändra</button>
          </div>

          <div className="settings-item">
            <span>Byt lösenord</span>
            <button className="secondary-btn">Ändra</button>
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
    </main>
  );
}

export default ProfilePage;
