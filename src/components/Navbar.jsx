import { Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

function Navbar({ darkMode, setDarkMode }) { // ✅ added props

  const logout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav
      style={{
        background: "#1f2937",
        padding: "15px 30px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >

      <h2>InternHelp</h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}> {/* slight align fix */}

        <Link to="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link to="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>

        {/* ✅ Added Profile */}
        <Link to="/profile" style={{ color: "white" }}>
          Profile
        </Link>

        <Link to="/login" style={{ color: "white" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "white" }}>
          Register
        </Link>

        {/* ✅ Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;