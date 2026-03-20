import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

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

const internshipPrices = {
  1: 499,
  2: 699,
  3: 999
};

function Payment({ darkMode }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const handlePayment = async () => {

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    // Validate card details if card payment is selected
    if (selectedMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
        alert("Please fill in all card details");
        return;
      }
      if (cardDetails.cardNumber.length !== 16) {
        alert("Card number must be 16 digits");
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        alert("CVV must be 3 digits");
        return;
      }
    }

    // Check if already enrolled
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid),
      where("internshipId", "==", id)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("You are already enrolled in this internship");
      navigate("/dashboard");
      return;
    }

    setLoading(true);

    // Fake delay (like real payment processing)
    setTimeout(async () => {

      try {
        await addDoc(collection(db, "enrollments"), {
          userId: user.uid,
          internshipId: id,
          progress: 0,
          completed: false,
          completedModules: [],
          paymentMethod: selectedMethod,
          enrolledAt: new Date().toISOString()
        });

        setLoading(false);
        alert("✅ Payment Successful! You've been enrolled in the internship.");
        navigate(`/internship/${id}`);

      } catch (error) {
        setLoading(false);
        alert("Error processing payment: " + error.message);
      }

    }, 2500);

  };

  const paymentMethods = [
    {
      id: "card",
      name: "💳 Credit/Debit Card",
      icon: "💳",
      description: "Fast and secure payment"
    },
    {
      id: "upi",
      name: "📱 UPI",
      icon: "📱",
      description: "Instant payment via UPI"
    },
    {
      id: "netbanking",
      name: "🏦 Net Banking",
      icon: "🏦",
      description: "Secure online banking"
    },
    {
      id: "wallet",
      name: "👛 Digital Wallet",
      icon: "👛",
      description: "Apple Pay, Google Pay, etc."
    }
  ];

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      paddingTop: "30px"
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .payment-card {
          animation: slideIn 0.5s ease forwards;
        }
        .method-option {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .method-option:hover {
          transform: translateY(-5px);
        }
        .method-option.selected {
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        input:focus {
          outline: none;
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
      `}</style>

      <div style={{
        maxWidth: "700px",
        margin: "0 auto"
      }}>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "white"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "800",
            margin: "0 0 10px 0",
            letterSpacing: "-0.5px"
          }}>
            💳 Payment
          </h1>
          <p style={{
            fontSize: "15px",
            opacity: 0.9,
            margin: "0"
          }}>
            Secure payment to start your internship journey
          </p>
        </div>

        {/* Order Summary */}
        <div className="payment-card" style={{
          background: darkMode ? "#2a2a4a" : "white",
          borderRadius: "15px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
        }}>
          <h2 style={{
            color: darkMode ? "white" : "#333",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "20px",
            margin: "0 0 20px 0"
          }}>
            Order Summary
          </h2>

          <div style={{
            background: darkMode ? "#1a1a2e" : "#f5f5f5",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "15px"
            }}>
              <div style={{
                fontSize: "48px"
              }}>
                {internshipIcons[id]}
              </div>
              <div style={{
                flex: 1
              }}>
                <h3 style={{
                  margin: "0 0 5px 0",
                  color: darkMode ? "white" : "#333",
                  fontSize: "18px",
                  fontWeight: "700"
                }}>
                  {internshipList[id]}
                </h3>
                <p style={{
                  margin: "0",
                  color: darkMode ? "#aaa" : "#666",
                  fontSize: "14px"
                }}>
                  Complete internship program with all modules
                </p>
              </div>
            </div>

            <div style={{
              borderTop: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
              paddingTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{
                color: darkMode ? "#aaa" : "#666",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                Amount to Pay:
              </span>
              <span style={{
                color: "#667eea",
                fontSize: "28px",
                fontWeight: "800"
              }}>
                ₹{internshipPrices[id]}
              </span>
            </div>
          </div>

          {/* Features List */}
          <div style={{
            background: darkMode ? "rgba(102, 126, 234, 0.1)" : "#f0f4ff",
            borderRadius: "10px",
            padding: "15px",
            borderLeft: "4px solid #667eea"
          }}>
            <p style={{
              color: darkMode ? "#ddd" : "#333",
              fontSize: "13px",
              margin: "0",
              fontWeight: "600"
            }}>
              ✓ Lifetime access • ✓ Certificate • ✓ All modules • ✓ Support
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-card" style={{
          background: darkMode ? "#2a2a4a" : "white",
          borderRadius: "15px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
        }}>
          <h2 style={{
            color: darkMode ? "white" : "#333",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "20px",
            margin: "0 0 20px 0"
          }}>
            Select Payment Method
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "15px",
            marginBottom: "30px"
          }}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="method-option"
                style={{
                  background: selectedMethod === method.id
                    ? (darkMode ? "#1a3a52" : "#e7f3ff")
                    : (darkMode ? "#1a1a2e" : "#f9f9f9"),
                  border: selectedMethod === method.id
                    ? "2px solid #667eea"
                    : (darkMode ? "2px solid #444" : "2px solid #e0e0e0"),
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => setSelectedMethod(method.id)}
              >
                {selectedMethod === method.id && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#667eea",
                    color: "white",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "700"
                  }}>
                    ✓
                  </div>
                )}
                <div style={{
                  fontSize: "32px",
                  marginBottom: "10px"
                }}>
                  {method.icon}
                </div>
                <h4 style={{
                  margin: "0 0 5px 0",
                  color: darkMode ? "white" : "#333",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  {method.name.split(" ").slice(1).join(" ")}
                </h4>
                <p style={{
                  margin: "0",
                  color: darkMode ? "#aaa" : "#666",
                  fontSize: "11px"
                }}>
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          {/* Card Details Form (Only for Card Method) */}
          {selectedMethod === "card" && (
            <div style={{
              background: darkMode ? "#1a1a2e" : "#f9f9f9",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
            }}>
              <h3 style={{
                color: darkMode ? "white" : "#333",
                fontSize: "16px",
                fontWeight: "600",
                margin: "0 0 15px 0"
              }}>
                Card Details
              </h3>

              <input
                type="text"
                placeholder="Card Number (16 digits)"
                value={cardDetails.cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                  setCardDetails({...cardDetails, cardNumber: val});
                }}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  marginBottom: "12px",
                  border: darkMode ? "2px solid #444" : "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: darkMode ? "#2a2a4a" : "white",
                  color: darkMode ? "white" : "black",
                  boxSizing: "border-box",
                  fontFamily: "monospace",
                  letterSpacing: "2px"
                }}
              />

              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  marginBottom: "12px",
                  border: darkMode ? "2px solid #444" : "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: darkMode ? "#2a2a4a" : "white",
                  color: darkMode ? "white" : "black",
                  boxSizing: "border-box"
                }}
              />

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "0"
              }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (val.length >= 2) {
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    }
                    setCardDetails({...cardDetails, expiry: val});
                  }}
                  style={{
                    padding: "12px 15px",
                    border: darkMode ? "2px solid #444" : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    background: darkMode ? "#2a2a4a" : "white",
                    color: darkMode ? "white" : "black",
                    boxSizing: "border-box",
                    fontFamily: "monospace"
                  }}
                />
                <input
                  type="text"
                  placeholder="CVV (3 digits)"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                    setCardDetails({...cardDetails, cvv: val});
                  }}
                  style={{
                    padding: "12px 15px",
                    border: darkMode ? "2px solid #444" : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    background: darkMode ? "#2a2a4a" : "white",
                    color: darkMode ? "white" : "black",
                    boxSizing: "border-box",
                    fontFamily: "monospace",
                    letterSpacing: "2px"
                  }}
                />
              </div>
            </div>
          )}

          {/* UPI Details */}
          {selectedMethod === "upi" && (
            <div style={{
              background: darkMode ? "#1a1a2e" : "#f9f9f9",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
              textAlign: "center"
            }}>
              <p style={{
                color: darkMode ? "#aaa" : "#666",
                fontSize: "14px",
                margin: "0"
              }}>
                📱 You will be redirected to your UPI app to complete the payment
              </p>
            </div>
          )}

          {/* Wallet Details */}
          {selectedMethod === "wallet" && (
            <div style={{
              background: darkMode ? "#1a1a2e" : "#f9f9f9",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
              textAlign: "center"
            }}>
              <p style={{
                color: darkMode ? "#aaa" : "#666",
                fontSize: "14px",
                margin: "0"
              }}>
                👛 Choose from available digital wallets (Apple Pay, Google Pay, etc.)
              </p>
            </div>
          )}

          {/* Security Message */}
          <div style={{
            background: darkMode ? "rgba(40, 167, 69, 0.1)" : "#e8f5e9",
            borderRadius: "10px",
            padding: "12px 15px",
            border: "1px solid #28a745",
            textAlign: "center",
            marginBottom: "20px"
          }}>
            <p style={{
              color: "#28a745",
              fontSize: "12px",
              margin: "0",
              fontWeight: "600"
            }}>
              🔒 Your payment information is secure and encrypted
            </p>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px 30px",
              background: loading ? "#999" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderRadius: "50%",
                  borderTop: "2px solid transparent",
                  animation: "spin 0.8s linear infinite"
                }} />
                Processing Payment...
              </>
            ) : (
              `💳 Pay ₹${internshipPrices[id]}`
            )}
          </button>
        </div>

        {/* Help Text */}
        <div style={{
          textAlign: "center",
          color: "white",
          fontSize: "13px",
          opacity: "0.8"
        }}>
          <p style={{ margin: "0" }}>
            Need help? Contact support@internhelp.com
          </p>
          <p style={{ margin: "10px 0 0 0" }}>
            By clicking Pay, you agree to our Terms & Conditions
          </p>
        </div>

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

      </div>

    </div>
  );
}

export default Payment;