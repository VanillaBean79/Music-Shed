import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentProfile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    instrument: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Pre-fill form with user info
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age?.toString() || "",
        instrument: user.instrument || "",
      });
    }
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const ageInt = parseInt(formData.age, 10);

    if (isNaN(ageInt) || ageInt < 5) {
      setError("Age must be a number greater than 5.");
      return;
    }

    fetch(`/students/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, age: ageInt }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json().then((updatedUser) => {
            setUser(updatedUser);
            setError("");
            alert("Profile updated!");
          });
        } else {
          return r.json().then((data) => {
            setError(data.error || "Failed to update.");
          });
        }
      })
      .catch(() => setError("Network error."));
  }

  function handleDelete() {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    ) {
      fetch(`/students/${user.id}`, { method: "DELETE" }).then((r) => {
        if (r.ok) {
          setUser(null);
          navigate("/");
        } else {
          alert("Failed to delete account.");
        }
      });
    }
  }

  return (
    <div className="page-container">
      <h2>My Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Your age"
          required
          min="5"
        />
        <input
          type="text"
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
          placeholder="Your instrument"
          required
        />
        <button type="submit">Update Profile</button>
      </form>

      <button
        onClick={handleDelete}
        style={{ marginTop: "1rem", backgroundColor: "red", color: "white" }}
      >
        Delete My Account
      </button>
    </div>
  );
}

export default StudentProfile;
