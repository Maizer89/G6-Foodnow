import { API_URL } from "../lib/api";

async function authRequest(endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Något gick fel.");
  }

  return json;
}

export function loginUser(identifier, password) {
  return authRequest("/api/auth/local", {
    identifier,
    password,
  });
}

export function registerUser(username, email, password) {
  return authRequest("/api/auth/local/register", {
    username,
    email,
    password,
  });
}
