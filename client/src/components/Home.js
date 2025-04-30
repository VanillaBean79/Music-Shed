import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="logo">🎵 Music Shed 🎵</h1>
      <div className="button-group">
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Home;

