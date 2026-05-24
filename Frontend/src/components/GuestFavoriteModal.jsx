import { Link } from "react-router-dom";
import Button from "./Button";

export default function GuestFavoriteModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: "center", padding: "32px 24px" }}
      >
        <div
          style={{
            background: "rgba(255, 59, 48, 0.1)",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff3b30"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>

        <h2 style={{ marginBottom: "8px", fontSize: "22px" }}>
          Gillar du receptet?
        </h2>
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Skapa ett konto för att spara dina favoritrecept och komma åt dem när
          som helst.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/register"
            className="primary-btn"
            style={{
              width: "100%",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Skapa konto
          </Link>
          <Link
            to="/login"
            className="secondary-btn"
            style={{
              width: "100%",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Logga in
          </Link>
          <Button
            variant="ghost"
            className="modal-cancel-btn"
            onClick={onClose}
          >
            Avbryt
          </Button>
        </div>
      </div>
    </div>
  );
}
