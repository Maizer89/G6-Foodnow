import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { loginUser } from "../services/authService";

LoginPage.route = {
  path: "/login",
  label: "Logga in",
  guestOnly: true,
  index: 10,
};

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(identifier, password);
      login(data.jwt, data.user);
      navigate("/");
    } catch {
      setError("Fel användarnamn eller lösenord.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Logga in</h1>
          <p className="auth-subtitle">Välkommen tillbaka till FoodNow.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="search-input"
            type="text"
            placeholder="E-post eller användarnamn"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <input
            className="search-input"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit">Logga in</Button>
        </form>

        <div className="auth-footer">
          Har inget konto?{" "}
          <Link to="/register" className="auth-link">
            Skapa konto
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
