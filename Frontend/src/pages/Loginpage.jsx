import { useState } from "react";
import { Link } from "react-router-dom";

LoginPage.route = {
  path: "/login",
  label: "Login",
  index: 3,
};

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="E-post eller användarnamn"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Logga in</button>
    </form>
  );
}

export default LoginPage;
