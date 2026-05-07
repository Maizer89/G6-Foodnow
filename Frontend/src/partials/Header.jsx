import { NavLink } from 'react-router-dom'
import routes from '../routes.jsx'

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          {routes.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}