import { useNavigate } from "react-router-dom";

ProfilePage.route = {
  path: "profile",
  label: "Min Profil",
  index: 4,
};

function ProfilePage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwt");

    navigate("/login");
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Min profil</h1>

        <p className="page-subtitle">Hantera ditt konto och dina recept.</p>
      </div>

      <div className="profile-card">
        <img
          className="profile-avatar"
          src="https://i.pravatar.cc/150?img=12"
          alt="Avatar"
        />

        <div className="profile-info">
          <h2>Test User</h2>
          <p>test@example.com</p>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <strong>12</strong>
            <span>Recept</span>
          </div>

          <div className="stat">
            <strong>34</strong>
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
            <button className="secondary-btn">Visa</button>
          </div>

          <div className="settings-item">
            <span>Logga ut</span>
            <button className="primary-btn" onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
