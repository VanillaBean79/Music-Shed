// CreateAppointment.js
// CreateAppointment.js
import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

function CreateAppointment() {
  const { user } = useContext(UserContext);
  const [teachers, setTeachers] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const preselectedTeacherId = queryParams.get("teacher_id") || "";

  const [formData, setFormData] = useState({
    teacher_id: preselectedTeacherId,
    cost: "30",
    duration: "30",
    lesson_datetime: ""
  });

  useEffect(() => {
    fetch("/teachers")
      .then((res) => res.json())
      .then(setTeachers);
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const appointmentData = {
      ...formData,
      student_id: user.id,
      teacher_id: parseInt(formData.teacher_id),
      cost: parseInt(formData.cost),
      duration: parseInt(formData.duration),
    };

    fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((err) => Promise.reject(err));
      })
      .then(() => {
        alert("Appointment booked!");
        history.push("/teachers");
      })
      .catch((err) => alert(err.error || "Failed to create appointment"));
  }

  if (!user) return <p>Please log in to book a lesson.</p>;

  return (
    <div>
      <h2>Book Your Lesson</h2>
      <form onSubmit={handleSubmit}>
        <label>Teacher:</label>
        <select
          name="teacher_id"
          onChange={handleChange}
          value={formData.teacher_id}
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <br />

        <label>Cost:</label>
        <select name="cost" onChange={handleChange} value={formData.cost}>
          <option value="30">$30</option>
          <option value="40">$40</option>
          <option value="50">$50</option>
        </select>

        <br />

        <label>Duration:</label>
        <select
          name="duration"
          onChange={handleChange}
          value={formData.duration}
        >
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>

        <br />

        <label>Lesson Date & Time:</label>
        <input
          type="datetime-local"
          name="lesson_datetime"
          value={formData.lesson_datetime}
          onChange={handleChange}
        />

        <br />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default CreateAppointment;
