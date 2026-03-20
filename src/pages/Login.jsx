import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login({ darkMode }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: darkMode ? "#2a2a4a" : "white",
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        padding: "50px 40px",
        maxWidth: "420px",
        width: "100%",
        animation: "slideUp 0.5s ease"
      }}>
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          input:focus {
            outline: none;
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
          }
        `}</style>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "32px",
            color: darkMode ? "white" : "#333",
            marginBottom: "10px",
            fontWeight: "700"
          }}>Welcome Back</h1>
          <p style={{
            color: darkMode ? "#aaa" : "#666",
            fontSize: "14px",
            margin: "0"
          }}>Sign in to your account to continue</p>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginTop: "20px",
            border: "2px solid #e0e0e0",
            borderRadius: "10px",
            fontSize: "14px",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: darkMode ? "#1a1a2e" : "white",
            color: darkMode ? "white" : "black"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginTop: "15px",
            border: "2px solid #e0e0e0",
            borderRadius: "10px",
            fontSize: "14px",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: darkMode ? "#1a1a2e" : "white",
            color: darkMode ? "white" : "black"
          }}
        />

        <button
          onClick={loginUser}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginTop: "25px",
            background: loading ? "#999" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{
          marginTop: "25px",
          textAlign: "center",
          color: darkMode ? "#aaa" : "#666",
          fontSize: "14px"
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: "600",
            transition: "color 0.3s ease",
            cursor: "pointer"
          }}>Create one now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;