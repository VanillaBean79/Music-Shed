import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import TeachersList from "./TeachersList";
import Login from "./Login";
import NavBar from "./NavBar";
import StudentDashboard from "./StudentDashboard";
import Home from "./Home";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session")
      .then((r) => {
        if (r.ok) return r.json().then(setUser);
      });
  }, []);

  const handleLogout = () => {
    fetch("/logout", {
      method: "DELETE",
    }).then(() => setUser(null));
  };

  return (
    <Router>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<TeachersList user={user} />} /> {/* Teachers list at "/" */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<StudentDashboard user={user} />} /> {/* Student Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
