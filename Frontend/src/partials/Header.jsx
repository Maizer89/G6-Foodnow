import { NavLink } from "react-router-dom";
import routes from "../routes.jsx";

export default function Header() {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo">FoodNow</div>

        <nav className="nav">
          {routes
            .filter((route) => !route.hidden)
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
