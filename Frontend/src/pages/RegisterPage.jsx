import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

RegisterPage.route = {
  path: "/register",
  label: "Register",
  hidden: true,
};

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const response = await fetch(
      "http://localhost:1337/api/auth/local/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error?.message || "Kunde inte skapa konto.");
      return;
    }
    setSuccess("Kontot skapades! Du skickas till inloggning...");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Skapa konto</h1>

          <p className="auth-subtitle">
            Välkommen till FoodNow
            <br />
            Registrera dig för att spara och skapa egna recept.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="search-input"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="search-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="search-input"
            placeholder="Lösenord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="primary-btn">Skapa konto</button>
        </form>

        <div className="auth-footer">
          Har du redan ett konto?
          <Link to="/login" className="auth-link">
            Logga in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
