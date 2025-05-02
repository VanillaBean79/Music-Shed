import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeachersList from "./TeachersList";

function MyAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetch(`/students/${user.id}/appointments`)
        .then((r) => r.json())
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : []);
        });
    }
  }, [user]);

  function handleDeleteAppointment(id) {
    fetch(`/appointments/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
      } else {
        alert("Failed to delete appointment.");
      }
    });
  }

  if (!user) return <p>Please log in to view appointments.</p>;

  return (
    <div className="page-container">
      <h2>{user.name}'s Appointments</h2>
      <button className="nav-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      {appointments.length === 0 ? (
        <>
          <p>No appointments booked.</p>
          <TeachersList user={user} onNewAppointment={setAppointments} />
        </>
      ) : (
        <ul className="card-list">
          {appointments.map((appt) => (
            <li key={appt.id} className="card">
              <p><strong>Teacher:</strong> {appt.teacher.name}</p>
              <p><strong>Date:</strong> {new Date(appt.lesson_datetime).toLocaleString()}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteAppointment(appt.id)}
              >
                Delete Appointment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyAppointments;
