import { NavLink } from "react-router-dom";
import routes from "../routes.jsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">FoodNow</div>

        <nav className="nav">
          {routes
            .filter((route) => {
              if (route.hidden) return false;

              if (route.guestOnly && isLoggedIn) {
                return false;
              }

              if (route.authOnly && !isLoggedIn) {
                return false;
              }

              return true;
            })
            .map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                {label}
              </NavLink>
            ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        {isLoggedIn && (
          <button className="primary-btn logout-btn" onClick={handleLogout}>
            Logga ut
          </button>
        )}
        <div className="sidebar-card">Hitta recept med det du har hemma</div>
      </div>
    </aside>
  );
}
