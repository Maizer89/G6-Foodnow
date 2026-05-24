import { useState } from "react";
import { Link } from "react-router-dom";

RegisterPage.route = {
  path: "/register",
  label: "Register",
  hidden: true,
};

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

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

          <Button type="submit">Skapa konto</Button>
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
