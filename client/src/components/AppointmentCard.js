import React, { useState } from "react"

function AppointmentCard({ appointment, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [newDateTime, setNewDateTime] = useState(
    appointment.lesson_datetime.slice(0, 16) // "YYYY-MM-DDTHH:mm"
  )

  const handleEditSubmit = (e) => {
    e.preventDefault()

    fetch(`/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lesson_datetime: newDateTime }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((updatedAppt) => {
            onUpdate(updatedAppt)
            setEditing(false)
          })
        } else {
          alert("Failed to update appointment.")
        }
      })
  }

  return (
    <li>
      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          {appointment.teacher.name} —{" "}
          {new Date(appointment.lesson_datetime).toLocaleString()}
          <button onClick={() => setEditing(true)} style={{ marginLeft: "1em" }}>
            Edit
          </button>
          <button
            onClick={() => onDelete(appointment.id)}
            style={{ marginLeft: "0.5em" }}
          >
            Delete
          </button>
        </>
      )}
    </li>
  )
}

export default AppointmentCard
