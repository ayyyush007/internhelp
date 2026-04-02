import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const internshipList = {
  1: "Python Developer Internship",
  2: "Web Development Internship",
  3: "AI & Machine Learning Internship"
};

const internshipIcons = {
  1: "🐍",
  2: "🌐",
  3: "🤖"
};

function Dashboard({ darkMode }) {

  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        const enrollmentsData = [];
        await Promise.all(querySnapshot.docs.map(async (enrollDoc) => {
          const e = enrollDoc.data();
          let course = null;
          try {
            const courseDoc = await getDoc(doc(db, "courses", e.internshipId));
            if (courseDoc.exists()) {
              course = courseDoc.data();
            }
          } catch (_) {
            course = null;
          }
          enrollmentsData.push({ id: enrollDoc.id, ...e, course });
        }));

        setInternships(enrollmentsData);
      } catch (error) {
        console.error("Dashboard load error:", error);
        alert("Error loading dashboard data: " + (error.message || error));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubs();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: darkMode ? '#1a1a2e' : '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      paddingTop: "0"
    }}>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      {/* Header/Navbar */}
      <div style={{
        background: darkMode ? "#2a2a4a" : "rgba(255, 255, 255, 0.95)",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "0 0 15px 15px",
        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
        marginBottom: "40px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <h2 style={{
            color: darkMode ? "white" : "#667eea",
            fontSize: "24px",
            fontWeight: "800",
            margin: "0"
          }}>
            InternHelp
          </h2>
          <p style={{
            color: darkMode ? "#aaa" : "#666",
            fontSize: "13px",
            margin: "5px 0 0 0"
          }}>
            Welcome, {user?.email || "Student"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 25px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
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
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Section Title */}
        <div style={{
          color: "white",
          marginBottom: "40px",
          animation: "fadeInUp 0.6s ease"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "800",
            margin: "0 0 10px 0",
            letterSpacing: "-1px"
          }}>
            Your Internships
          </h1>
          <p style={{
            fontSize: "15px",
            opacity: 0.9,
            margin: "0"
          }}>
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Empty State */}
        {internships.length === 0 ? (
          <div style={{
            background: darkMode ? "#2a2a4a" : "white",
            borderRadius: "15px",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            marginBottom: "40px"
          }}>
            <div style={{
              fontSize: "64px",
              marginBottom: "20px"
            }}>
              📚
            </div>
            <h2 style={{
              color: darkMode ? "white" : "#333",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "10px"
            }}>
              No internships yet
            </h2>
            <p style={{
              color: darkMode ? "#aaa" : "#666",
              fontSize: "15px",
              marginBottom: "30px",
              maxWidth: "400px",
              margin: "0 auto 30px"
            }}>
              Explore our available internship programs and start your journey with us today!
            </p>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "12px 35px",
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
                Explore Internships
              </button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "30px"
          }}>
            {internships.map((internship, index) => {
              const progress = Math.max(0, Math.min(100, Number(internship.progress ?? 0)));
              return (
                <div
                  key={index}
                  className="internship-card"
                  style={{
                    background: "white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                {/* Header */}
                <div style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "30px 25px",
                  color: "white",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "40px",
                    marginBottom: "12px"
                  }}>
                    {internship.course?.icon || internshipIcons[internship.internshipId] || "📘"}
                  </div>
                  <h3 style={{
                    margin: "0",
                    fontSize: "18px",
                    fontWeight: "700"
                  }}>
                    {internship.course?.title || internshipList[internship.internshipId] || "Internship"}
                  </h3>
                </div>

                {/* Content */}
                <div style={{
                  padding: "25px"
                }}>
                  {/* Progress Section */}
                  <div style={{
                    marginBottom: "25px"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}>
                      <label style={{
                        fontWeight: "600",
                        color: "#333",
                        fontSize: "14px"
                      }}>
                        Progress
                      </label>
                      <span style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#667eea"
                      }}>
                        {progress}%
                      </span>
                    </div>
                    <div style={{
                      background: "#e0e0e0",
                      borderRadius: "10px",
                      height: "10px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        height: "100%",
                        width: `${progress}%`,
                        transition: "width 0.5s ease",
                        borderRadius: "10px"
                      }} />
                    </div>
                  </div>

                  {/* Status Card */}
                  <div style={{
                    background: progress === 100 ? "#d4edda" : "#e7f3ff",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "20px",
                    textAlign: "center"
                  }}>
                    <p style={{
                      margin: "0",
                      fontSize: "13px",
                      color: progress === 100 ? "#155724" : "#004085",
                      fontWeight: "600"
                    }}>
                      {progress === 100 ? "✓ Completed" : "In Progress"}
                    </p>
                  </div>

                  {/* Continue Button */}
                  <Link to={`/internship/${internship.internshipId}`} style={{ textDecoration: "none" }}>
                    <button style={{
                      width: "100%",
                      padding: "12px 16px",
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
                      Continue Internship →
                    </button>
                  </Link>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;