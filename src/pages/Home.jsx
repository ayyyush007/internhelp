import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const defaultInternships = [
  {
    id: "1",
    title: "Python Developer Internship",
    duration: "4 weeks",
    price: 499,
    icon: "🐍",
    description: "Master Python programming and build real-world applications",
    modules: [{ num: 1, title: "Python Basics", duration: "1 week", content: "Intro to Python, data types, control flow" }]
  },
  {
    id: "2",
    title: "Web Development Internship",
    duration: "6 weeks",
    price: 699,
    icon: "🌐",
    description: "Learn frontend and backend development with modern frameworks",
    modules: [{ num: 1, title: "Frontend", duration: "2 weeks", content: "HTML, CSS, JavaScript" }]
  },
  {
    id: "3",
    title: "AI & Machine Learning Internship",
    duration: "8 weeks",
    price: 999,
    icon: "🤖",
    description: "Dive into AI, machine learning, and data science concepts",
    modules: [{ num: 1, title: "ML Basics", duration: "2 weeks", content: "Supervised and unsupervised learning" }]
  }
];

function Home({ darkMode }) {
  const [internships, setInternships] = useState(defaultInternships);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const items = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

        if (items.length > 0) {
          setInternships(items);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Unable to load internships from Firestore. Using defaults instead.");
        setInternships(defaultInternships);
      }
    };

    fetchInternships();
  }, []);


  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "40px 20px"
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .internship-card {
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s ease;
        }
        .internship-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        textAlign: "center",
        marginBottom: "60px",
        color: "white",
        animation: "fadeInUp 0.6s ease"
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "800",
          marginBottom: "15px",
          letterSpacing: "-1px"
        }}>
          InternHelp Platform
        </h1>
        <p style={{
          fontSize: "18px",
          marginBottom: "10px",
          opacity: 0.95
        }}>
          Purchase internships, complete modules, and earn certificates
        </p>
        <p style={{
          fontSize: "14px",
          opacity: 0.8
        }}>
          Launch your tech career with hands-on learning experiences
        </p>
      </div>

      {/* Internships Grid */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          marginBottom: "40px"
        }}>
          {internships.map((internship, index) => (
            <div
              key={internship.id}
              className="internship-card"
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "30px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                fontSize: "48px",
                marginBottom: "15px",
                textAlign: "center"
              }}>
                {internship.icon}
              </div>

              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "12px",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {internship.title}
              </h3>

              <p style={{
                color: "#666",
                fontSize: "14px",
                marginBottom: "20px",
                minHeight: "60px",
                textAlign: "center",
                lineHeight: "1.6"
              }}>
                {internship.description}
              </p>

              <div style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <p style={{
                  color: "#666",
                  fontSize: "13px",
                  margin: "8px 0"
                }}>
                  <strong>Duration:</strong> {internship.duration}
                </p>
                <p style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#667eea",
                  margin: "8px 0"
                }}>
                  {internship.price}
                </p>
              </div>

              <Link to={`/internship/${internship.id}`} style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  padding: "13px 20px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                }}
                >
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: darkMode ? "#2a2a4a" : "white",
        borderRadius: "15px",
        padding: "40px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{
          color: darkMode ? "white" : "#333",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "15px"
        }}>
          Ready to Start?
        </h2>
        <p style={{
          color: darkMode ? "#aaa" : "#666",
          fontSize: "15px",
          marginBottom: "25px"
        }}>
          Sign in to your account or create a new one to purchase internships
        </p>
        <div style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "12px 30px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
            }}
            >
              Sign In
            </button>
          </Link>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "12px 30px",
              background: "white",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#667eea";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#667eea";
            }}
            >
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;