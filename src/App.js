import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InternshipDetails from "./pages/InternshipDetails";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import Refer from "./pages/Refer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <Routes>

        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
        <Route path="/refer" element={<Refer darkMode={darkMode} />} />
        <Route path="/admin" element={<Admin darkMode={darkMode} />} />
        <Route path="/internship/:id" element={<InternshipDetails darkMode={darkMode} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} />} />
        <Route path="/payment/:id" element={<Payment darkMode={darkMode} />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;