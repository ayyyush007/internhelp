import { useState } from "react";
import { useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

function Register({ darkMode }) {
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get("ref") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        referredBy: referralCode || null,
        signupAt: new Date().toISOString()
      });

      alert(`User registered successfully! ${referralCode ? "Thanks for using a referral code." : ""}`);
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      alert(error.message);

    } finally {
      setLoading(false);
    }

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
          }}>Create Account</h1>
          <p style={{
            color: darkMode ? "#aaa" : "#666",
            fontSize: "14px",
            margin: "0"
          }}>Join us and start your journey today</p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
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
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
          onClick={registerUser}
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p style={{
          marginTop: "25px",
          textAlign: "center",
          color: darkMode ? "#aaa" : "#666",
          fontSize: "14px"
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: "600",
            transition: "color 0.3s ease",
            cursor: "pointer"
          }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;