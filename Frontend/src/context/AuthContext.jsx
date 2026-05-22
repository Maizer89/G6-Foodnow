import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    async function fetchUser() {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        try {
          const res = await fetch(
            "http://localhost:1337/api/users/me?populate[profilePic]=true&populate[favorites][populate][image]=true",
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          if (res.ok) {
            const userData = await res.json();
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          } else if (res.status === 401) {
            // Only logout if unauthorized
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    }
    fetchUser();
  }, []);

  function login(jwt, userData) {
    localStorage.setItem("jwt", jwt);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  }

  function updateUser(userData) {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
