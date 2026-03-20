import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile({ darkMode }) {

  const [userData, setUserData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Internship data
  const internshipList = {
    "1": "Web Development",
    "2": "UI/UX Design",
    "3": "Machine Learning"
  };

  const internshipIcons = {
    "1": "🌐",
    "2": "🎨",
    "3": "🤖"
  };

  useEffect(() => {

    const fetchData = async () => {

      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Get user info
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Get enrollments
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });

        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchData();

  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "40px 20px",
      paddingTop: "30px"
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
        .profile-card {
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s ease;
        }
        .stat-box {
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s ease;
        }
        .stat-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        .enrollment-card {
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s ease;
        }
        .enrollment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
        }
      `}</style>

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "50px",
          color: "white"
        }}>
          <h1 style={{
            fontSize: "42px",
            fontWeight: "800",
            margin: "0 0 10px 0",
            letterSpacing: "-1px"
          }}>
            👤 My Profile
          </h1>
          <p style={{
            fontSize: "16px",
            opacity: 0.9,
            margin: "0"
          }}>
            Track your learning journey and achievements
          </p>
        </div>

        {/* User Info Card */}
        {userData && (
          <div className="profile-card" style={{
            background: "white",
            borderRadius: "15px",
            padding: "40px 30px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            marginBottom: "40px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              marginBottom: "30px"
            }}>
              <div style={{
                fontSize: "60px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                👤
              </div>
              <div>
                <h2 style={{
                  color: "#333",
                  margin: "0 0 10px 0",
                  fontSize: "28px",
                  fontWeight: "700"
                }}>
                  {userData.name}
                </h2>
                <p style={{
                  color: "#666",
                  margin: "0",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  ✉️ {userData.email}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
              paddingTop: "30px",
              borderTop: "2px solid #f0f0f0"
            }}>
              <div className="stat-box" style={{
                background: "#f0f4ff",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <h3 style={{
                  color: "#667eea",
                  fontSize: "28px",
                  fontWeight: "800",
                  margin: "0 0 5px 0"
                }}>
                  {enrollments.length}
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "600"
                }}>
                  Enrolled Internships
                </p>
              </div>

              <div className="stat-box" style={{
                background: "#e8f5e9",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <h3 style={{
                  color: "#28a745",
                  fontSize: "28px",
                  fontWeight: "800",
                  margin: "0 0 5px 0"
                }}>
                  {enrollments.filter(e => e.completed).length}
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "600"
                }}>
                  Completed
                </p>
              </div>

              <div className="stat-box" style={{
                background: "#fff3e0",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <h3 style={{
                  color: "#ff9800",
                  fontSize: "28px",
                  fontWeight: "800",
                  margin: "0 0 5px 0"
                }}>
                  {enrollments.length > 0
                    ? Math.round(
                        enrollments.reduce((sum, e) => sum + e.progress, 0) /
                          enrollments.length
                      )
                    : 0}
                  %
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "600"
                }}>
                  Avg Progress
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Internships Section */}
        <div>
          <h2 style={{
            color: "white",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📚 My Learning Journey
          </h2>

          {enrollments.length === 0 ? (
            <div className="profile-card" style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "15px",
              padding: "50px 30px",
              textAlign: "center"
            }}>
              <p style={{
                color: "#666",
                fontSize: "16px",
                margin: "0",
                fontWeight: "600"
              }}>
                No internships enrolled yet. Start your learning journey today! 🚀
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px"
            }}>
              {enrollments.map((item, index) => (
                <div key={index} className="enrollment-card" style={{
                  background: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease"
                }}>
                  {/* Header */}
                  <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "25px",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start"
                  }}>
                    <div style={{
                      display: "flex",
                      gap: "15px",
                      alignItems: "start"
                    }}>
                      <div style={{
                        fontSize: "40px"
                      }}>
                        {internshipIcons[item.internshipId]}
                      </div>
                      <div>
                        <h3 style={{
                          margin: "0 0 5px 0",
                          fontSize: "18px",
                          fontWeight: "700"
                        }}>
                          {internshipList[item.internshipId]}
                        </h3>
                        <p style={{
                          margin: "0",
                          fontSize: "13px",
                          opacity: 0.9
                        }}>
                          ID: {item.internshipId}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: item.completed ? "#28a745" : "#ff9800",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      whiteSpace: "nowrap"
                    }}>
                      {item.completed ? "✅ Completed" : "⏳ In Progress"}
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{
                    padding: "20px 25px"
                  }}>
                    <div style={{
                      marginBottom: "15px"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px"
                      }}>
                        <span style={{
                          color: "#333",
                          fontWeight: "600",
                          fontSize: "14px"
                        }}>
                          Progress
                        </span>
                        <span style={{
                          color: "#667eea",
                          fontWeight: "700",
                          fontSize: "16px"
                        }}>
                          {item.progress}%
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        background: "#e0e0e0",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${item.progress}%`,
                          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                          transition: "width 0.5s ease",
                          borderRadius: "10px"
                        }} />
                      </div>
                    </div>

                    {/* Status Details */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px"
                    }}>
                      <div style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <p style={{
                          margin: "0",
                          color: "#666",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          Status
                        </p>
                        <p style={{
                          margin: "5px 0 0 0",
                          color: "#333",
                          fontSize: "13px",
                          fontWeight: "700"
                        }}>
                          {item.completed ? "✅ Done" : "📖 Learning"}
                        </p>
                      </div>
                      <div style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <p style={{
                          margin: "0",
                          color: "#666",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          Certificate
                        </p>
                        <p style={{
                          margin: "5px 0 0 0",
                          color: "#333",
                          fontSize: "13px",
                          fontWeight: "700"
                        }}>
                          {item.completed ? "🎓 Ready" : "⏳ Soon"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default Profile;