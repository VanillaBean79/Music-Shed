// MyAppointments.js
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

function MyAppointments() {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/students/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments || []);
        });
    }
  }, [user]);

  if (!user) return <p>Please log in to view your appointments.</p>;

  return (
    <div>
      <h2>{user.name}'s Appointments</h2>
      <ul>
        {appointments.length === 0 ? (
          <p>No upcoming lessons.</p>
        ) : (
          appointments.map((appt) => (
            <li key={appt.id}>
              Lesson with Teacher #{appt.teacher_id} on{" "}
              {new Date(appt.lesson_datetime).toLocaleString()} — ${appt.cost} for {appt.duration} mins
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MyAppointments;
