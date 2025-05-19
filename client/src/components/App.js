// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Changed to BrowserRouter
import Signup from "./Signup";
import Login from "./Login";
import NavBar from "./NavBar";
import StudentDashboard from "./StudentDashboard";
import Home from "./Home";
import { UserProvider } from "./UserContext";
import Test from "./Test";


function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/test" element={<Test />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

