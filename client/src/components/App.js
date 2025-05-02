// App.js

// App.js
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home"
import Signup from "./Signup"
import TeachersList from "./TeachersList"
import Login from "./Login"
import MyAppointments from "./MyAppointments"
import NavBar from "./NavBar"
import StudentProfile from "./StudentProfile"



function App() {
  const [user, setUser] = useState(null)


  useEffect(()=>{
    fetch("/check_session")
    .then((r)=>{
      if (r.ok) return r.json().then(setUser)
    })
  },[])



  return (
    <Router>
      <NavBar user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home  user={user}/>} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/teachers" element={<TeachersList user={user}/>}/>
        <Route path="/my-appointments" element={<MyAppointments user={user}/>}/>
        <Route path="/profile" element={<StudentProfile user={user} setUser={setUser} />}/>
      </Routes>
    </Router>
  );
}

export default App;
