import React from "react";
import { useHistory } from "react-router-dom";
// import "./Home.css"; // optional

function Home() {
  const history = useHistory();

  return (
    <div className="home-container">
      <h1 className="logo">🎵 Music Shed 🎵</h1>
      <div className="button-group">
        <button onClick={() => history.push("/signup")}>Register</button>
        <button onClick={() => history.push("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Home;
