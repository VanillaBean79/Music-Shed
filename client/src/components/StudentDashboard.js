import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";

function StudentDashboard({ user, setUser }) {
  const [formData, setFormData] = useState({ name: "", age: "", instrument: "" });
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age?.toString() || "",
        instrument: user.instrument || "",
      });

      fetch(`/students/${user.id}/appointments`)
        .then((r) => r.json())
        .then((data) => setAppointments(Array.isArray(data) ? data : []));
    }
  }, [user]);

  if (!user) return <p>Please log in to view your dashboard.</p>;

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
          });
        } else {
          return r.json().then((data) => setError(data.error || "Update failed"));
        }
      })
      .catch(() => setError("Network error"));
  }

  function handleDeleteAppointment(id) {
    fetch(`/appointments/${id}`, { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        alert("Failed to delete appointment.");
      }
    });
  }

  function handleUpdateAppointment(updatedAppointment) {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      )
    );
  }
  
  

  return (
    <div className="page-container">
      <h2>Welcome, {user.username}</h2>

      <section>
        <h3>Your Profile</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            min="5"
            required
          />
          <input
            type="text"
            name="instrument"
            value={formData.instrument}
            onChange={handleChange}
            placeholder="Instrument"
            required
          />
          <button type="submit">Update Profile</button>
        </form>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>Your Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          <ul>
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onDelete={handleDeleteAppointment}
                onUpdate={handleUpdateAppointment}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default StudentDashboard;
