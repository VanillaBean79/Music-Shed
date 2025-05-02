import React from "react";

function AppointmentCard({ appointment, onDelete }) {
  return (
    <li>
      {appointment.teacher.name} - {new Date(appointment.lesson_datetime).toLocaleString()}
      <button onClick={() => onDelete(appointment.id)} style={{ marginLeft: "1em" }}>
        Delete
      </button>
    </li>
  );
}

export default AppointmentCard;
