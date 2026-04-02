import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";

const ADMIN_EMAILS = ["admin@internhelp.com"];

function Navbar({ darkMode, setDarkMode }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubs();
  }, []);

  const logout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  return (
    <nav
      style={{
        background: "#1f2937",
        padding: "15px 30px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <h2>InternHelp</h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link to="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>

        <Link to="/refer" style={{ color: "white" }}>
          Refer & Earn
        </Link>

        {isAdmin && (
          <Link to="/admin" style={{ color: "white" }}>
            Admin Panel
          </Link>
        )}

        <Link to="/profile" style={{ color: "white" }}>
          Profile
        </Link>

        {!currentUser ? (
          <>
            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} style={{ background: "transparent", border: "1px solid white", color: "white", borderRadius: "8px", cursor: "pointer" }}>
            Logout
          </button>
        )}

        <button onClick={() => setDarkMode(!darkMode)} style={{ background: "transparent", border: "1px solid white", color: "white", borderRadius: "8px", cursor: "pointer" }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;