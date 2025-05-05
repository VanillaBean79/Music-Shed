import React from "react";

function Home() {
  return (
    <div className="page-container" style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>
        <span role="img" aria-label="music-note">🎵</span>{" "}
        Music Shed{" "}
        <span role="img" aria-label="music-note">🎵</span>
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Welcome to your place for private music lessons.
      </p>
    </div>
  );
}

export default Home;
