import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";
import routes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...routes.map((route) => ({
        path: route.path === "/" ? undefined : route.path,
        index: route.path === "/",
        element: (
          <ProtectedRoute authOnly={route.authOnly} guestOnly={route.guestOnly}>
            {route.element}
          </ProtectedRoute>
        ),
      })),
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
