import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const ADMIN_EMAILS = ["admin@internhelp.com"];

function Admin({ darkMode }) {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", duration: "", price: "", icon: "📘", description: "", modules: [] });
  const [moduleDraft, setModuleDraft] = useState({ title: "", duration: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      if (!ADMIN_EMAILS.includes(currentUser.email)) {
        navigate("/");
        return;
      }

      await fetchCourses();
      setLoading(false);
    });

    return () => unsubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setCourses(list);
  };

  const saveCourse = async () => {
    if (!form.title.trim() || !form.duration.trim() || !form.price.trim() || !form.description.trim()) {
      alert("Please fill out all required fields");
      return;
    }

    if (!form.modules || form.modules.length === 0) {
      alert("Please add at least one module");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        const item = doc(db, "courses", editingId);
        await updateDoc(item, {
          ...form,
          price: Number(form.price)
        });
        alert("Course updated successfully");
      } else {
        await addDoc(collection(db, "courses"), {
          ...form,
          price: Number(form.price),
          createdAt: new Date().toISOString()
        });
        alert("Course created successfully");
      }

      setForm({ title: "", duration: "", price: "", icon: "📘", description: "", modules: [] });
      setModuleDraft({ title: "", duration: "", content: "" });
      setEditingId(null);
      await fetchCourses();

    } catch (error) {
      alert("Unable to save course: " + error.message);

    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    const normalizedModules = (course.modules || []).map((module, index) => ({
      num: module.num != null ? module.num : index + 1,
      title: module.title || `Module ${index + 1}`,
      duration: module.duration || "",
      content: module.content || ""
    }));

    setForm({
      title: course.title,
      duration: course.duration,
      price: String(course.price),
      icon: course.icon,
      description: course.description,
      modules: normalizedModules
    });
    setModuleDraft({ title: "", duration: "", content: "" });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    setLoading(true);
    await deleteDoc(doc(db, "courses", id));
    await fetchCourses();
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: darkMode ? "#1a1a2e" : "#f0f4ff", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
        Admin Panel Loading...
      </div>
    );
  }

  return (
    <div style={{ background: darkMode ? "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)" : "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", minHeight: "100vh", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", color: "white" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700" }}>👑 Admin Course Management</h1>
        <p style={{ opacity: 0.9 }}>Add, edit, and delete internship courses available to learners.</p>
        <p style={{ opacity: 0.85, marginTop: "6px" }}>Signed in as: {user?.email || "Admin"}</p>

        <div style={{ marginTop: "25px", background: darkMode ? "#1e1e3a" : "white", padding: "20px", borderRadius: "15px", color: darkMode ? "white" : "#333" }}>
          <h2 style={{ margin: 0 }}>{editingId ? "Edit Course" : "Add New Course"}</h2>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />
          <input
            placeholder="Duration (e.g., 4 weeks)"
            value={form.duration}
            onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
            style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />
          <input
            placeholder="Price (numeric)"
            value={form.price}
            type="number"
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />
          <input
            placeholder="Icon (emoji)"
            value={form.icon}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
            style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows="3"
            style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
          />

          <h3 style={{ marginTop: "15px", marginBottom: "8px" }}>Modules</h3>

          <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
            <input
              placeholder="Module title"
              value={moduleDraft.title}
              onChange={(e) => setModuleDraft((prev) => ({ ...prev, title: e.target.value }))}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <input
              placeholder="Module duration (e.g., 1 week)"
              value={moduleDraft.duration}
              onChange={(e) => setModuleDraft((prev) => ({ ...prev, duration: e.target.value }))}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <textarea
              placeholder="Module content"
              value={moduleDraft.content}
              onChange={(e) => setModuleDraft((prev) => ({ ...prev, content: e.target.value }))}
              rows="3"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <button
              onClick={() => {
                if (!moduleDraft.title.trim() || !moduleDraft.duration.trim() || !moduleDraft.content.trim()) {
                  alert("Please fill all module fields");
                  return;
                }

                setForm((prev) => {
                  const existing = prev.modules || [];
                  const nextNum = existing.length > 0 ? Math.max(...existing.map((m) => m.num || 0)) + 1 : 1;
                  return {
                    ...prev,
                    modules: [...existing, { num: nextNum, ...moduleDraft }]
                  };
                });

                setModuleDraft({ title: "", duration: "", content: "" });
              }}
              style={{ width: "160px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", height: "40px", cursor: "pointer" }}
            >
              Add Module
            </button>
          </div>

          {form.modules && form.modules.length > 0 && (
            <div style={{ background: "rgba(0, 0, 0, 0.04)", padding: "12px", borderRadius: "10px", marginBottom: "12px" }}>
              {form.modules.map((module, idx) => (
                <div key={idx} style={{ marginBottom: "8px", padding: "8px", background: darkMode ? "#2a2a3a" : "#f4f5f7", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>#{idx + 1} {module.title}</strong>
                    <button onClick={() => setForm((prev) => ({ ...prev, modules: prev.modules.filter((_, i) => i !== idx) }))} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", padding: "4px 8px" }}>Remove</button>
                  </div>
                  <p style={{ margin: "4px 0" }}>{module.duration}</p>
                  <p style={{ margin: "4px 0", color: darkMode ? "#ccc" : "#555" }}>{module.content}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={saveCourse}
            style={{ marginTop: "15px", background: "#667eea", color: "white", border: "none", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}
          >
            {editingId ? "Update Course" : "Create Course"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm({ title: "", duration: "", price: "", icon: "📘", description: "", modules: [] }); setModuleDraft({ title: "", duration: "", content: "" }); }}
              style={{ marginTop: "15px", marginLeft: "10px", background: "#888", color: "white", border: "none", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Existing Courses</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "15px", marginTop: "15px" }}>
            {courses.map((course) => (
              <div key={course.id} style={{ background: darkMode ? "#1e1e3a" : "white", borderRadius: "15px", padding: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", color: darkMode ? "white" : "#333" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{course.icon || "📘"} {course.title}</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.85 }}>{course.description}</p>
                <p style={{ margin: "0 0 10px 0" }}>Duration: {course.duration}</p>
                <p style={{ margin: "0 0 10px 0" }}>Price: ₹{course.price}</p>
                <p style={{ fontSize: "13px", margin: "0 0 12px 0", color: darkMode ? "#9eb1e2" : "#667" }}>
                  Modules: {Array.isArray(course.modules) ? course.modules.length : 0}
                </p>                <button onClick={() => handleEdit(course)} style={{ marginRight: "8px", padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#22c55e", color: "white" }}>Edit</button>
                <button onClick={() => handleDelete(course.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#ef4444", color: "white" }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
