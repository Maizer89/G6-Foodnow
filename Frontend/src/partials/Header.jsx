import { NavLink } from "react-router-dom";
import routes from "../routes.jsx";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">FoodNow</div>

        <nav className="nav">
          {routes
            .filter((route) => {
              if (route.hidden) return false;

              if (route.path === "/login" && isLoggedIn) {
                return false;
              }

              if (route.path === "/profile" && !isLoggedIn) {
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

      <div className="sidebar-card">Hitta recept med det du har hemma</div>
    </aside>
  );
}
