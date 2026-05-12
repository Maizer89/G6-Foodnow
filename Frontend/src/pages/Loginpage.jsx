import { Link } from "react-router-dom";

Login.route = {
  path: "/login",
  label: "Login",
  index: 3,
};

export default function Login() {
  return (
    <div className="auth-footer">
      Har inget konto?{" "}
      <Link to="/register" className="auth-link">
        Skapa konto
      </Link>
    </div>
  );
}
