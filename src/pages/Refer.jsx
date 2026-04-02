import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

function Refer({ darkMode }) {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      await fetchReferrals(currentUser.uid);
      setLoading(false);
    });

    return () => unsubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchReferrals = async (userId) => {
    try {
      const q = query(collection(db, "referrals"), where("referrerId", "==", userId));
      const querySnapshot = await getDocs(q);

      const list = [];
      querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setReferrals(list);
    } catch (error) {
      console.error("Fetch referrals error:", error);
      alert("Cannot load your referrals due to permission issues. Please contact support.");
      setReferrals([]);
    }
  };

  const sendReferral = async () => {
    if (!friendEmail.trim()) {
      alert("Please enter friend email");
      return;
    }
    if (friendEmail.trim().toLowerCase() === user.email.toLowerCase()) {
      alert("You cannot refer your own email");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "referrals"), {
        referrerId: user.uid,
        referrerEmail: user.email,
        friendEmail: friendEmail.trim().toLowerCase(),
        status: "pending",
        rewardPoints: 50,
        createdAt: new Date().toISOString()
      });

      setFriendEmail("");
      await fetchReferrals(user.uid);
      alert("Referral sent! Ask your friend to register with your code.");
    } catch (error) {
      alert("Unable to send referral: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: darkMode ? "#1a1a2e" : "#f0f4ff", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
        Loading Refer & Earn...
      </div>
    );
  }

  const referralCode = user?.uid ? `${user.uid.slice(0, 6)}-${user.email.split("@")[0]}` : "";
  const totalPoints = referrals.reduce((sum, r) => sum + (r.status === "redeemed" ? r.rewardPoints : 0), 0);

  return (
    <div style={{ background: darkMode ? "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)" : "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", minHeight: "100vh", padding: "30px 20px", color: "white" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1>🌟 Refer & Earn</h1>
        <p>Share your referral link with friends and earn credits.</p>

        <div style={{ background: darkMode ? "#1e1e3a" : "white", color: darkMode ? "white" : "#333", borderRadius: "15px", padding: "20px", marginTop: "20px" }}>
          <h2>Your Referral Code</h2>
          <p style={{ fontSize: "1.5rem", fontWeight: "700", margin: "8px 0" }}>{referralCode}</p>
          <p>Share this code with your friend during signup to earn 50 reward points when they join and pay for an internship.</p>
          <input
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="Friend's email"
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />
          <button onClick={sendReferral} disabled={loading} style={{ marginTop: "12px", background: "#22c55e", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer" }}>
            {loading ? "Sending..." : "Send Referral"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "15px", marginTop: "22px" }}>
          <div style={{ background: darkMode ? "#1e1e3a" : "white", color: darkMode ? "white" : "#333", borderRadius: "12px", padding: "16px" }}>
            <h3>Total Referrals</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0" }}>{referrals.length}</p>
          </div>
          <div style={{ background: darkMode ? "#1e1e3a" : "white", color: darkMode ? "white" : "#333", borderRadius: "12px", padding: "16px" }}>
            <h3>Reward Points</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0" }}>{totalPoints}</p>
          </div>
        </div>

        <div style={{ marginTop: "20px", background: darkMode ? "#1e1e3a" : "white", color: darkMode ? "white" : "#333", borderRadius: "12px", padding: "16px" }}>
          <h3>Referral History</h3>
          {referrals.length === 0 ? (
            <p>No referrals yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {referrals.map((item) => (
                <li key={item.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
                  <strong>{item.friendEmail}</strong> — {item.status} — {item.rewardPoints} pts
                </li>
              ))}
            </ul>
          )}
        </div>

        <p style={{ marginTop: "24px", color: darkMode ? "#aaa" : "#555" }}>Note: In this POC, referral reward status is manually updated through Firestore backend rules or console for demo.</p>
      </div>
    </div>
  );
}

export default Refer;
