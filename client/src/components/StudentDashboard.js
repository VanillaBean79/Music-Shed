import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import NewTeacherForm from "./NewTeacherForm";
import ScheduleLessonForm from "./ScheduleLessonForm"



function StudentDashboard() {
  const { user, teachers, setUser, setTeachers, loading } = useContext(UserContext);
  const [editingApptId, setEditingApptId] = useState(null);
  const [newLessonTime, setNewLessonTime] = useState("");
  

  const navigate = useNavigate();

  if (loading || !user) return <p>Loading student dashboard...</p>;


  const handleCancel = (appointmentId, teacherId) => {
    fetch(`/appointments/${appointmentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel appointment");
        return res.json();
      })
      .then(() => {
        alert("Appointment cancelled!");
        const updatedTeachers = [...user.teachers];
        const teacherIndex = updatedTeachers.findIndex((t) => t.id === teacherId);
  
        if (teacherIndex !== -1) {
          updatedTeachers[teacherIndex].appointments = updatedTeachers[teacherIndex].appointments.filter(
            (appt) => appt.id !== appointmentId
          );
        }
  
        // After appointment deletion, filter out teachers with no appointments
        const cleanedTeachers = updatedTeachers.filter((t) => t.appointments && t.appointments.length > 0);
        
        // Update state with teachers who still have appointments
        setUser({ ...user, teachers: cleanedTeachers });
      })
      .catch((err) => {
        console.error("Cancel error:", err);
        alert("Failed to cancel appointment");
      });
  };
  
  const handleUpdate = (appointmentId) => {
    if (!newLessonTime) return alert("Please choose a new time.");

    fetch(`/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ lesson_datetime: newLessonTime }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed.");
        return res.json();
      })
      .then((updatedAppt) => {
        alert("Appointment updated!");

        const updatedTeachers = [...user.teachers];
        const teacherIndex = updatedTeachers.findIndex((t) => t.id === updatedAppt.teacher_id);

        if (teacherIndex !== -1) {
          updatedTeachers[teacherIndex].appointments = updatedTeachers[teacherIndex].appointments.map((appt) =>
            appt.id === updatedAppt.id ? updatedAppt : appt
          );
        }

        setUser({ ...user, teachers: updatedTeachers });
        setEditingApptId(null);
      })
      .catch((error) => {
        console.error("Error updating appointment", error);
        alert("Appointment not updated.");
      });
  };

  

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}!</h2>

      {/* Profile Display Only */}
      <div style={{ marginBottom: "2em" }}>
        <h3>Your Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Instrument:</strong> {user.instrument}</p>
      </div>

      {/* Schedule a Lesson */}
      <ScheduleLessonForm 
      teachers={teachers}
      user={user}
      setUser={setUser}
      />
      {/* Create a New Teacher */}
      <NewTeacherForm 
      teachers={teachers} 
      setTeachers={setTeachers} 
      />

      {/* Appointments Section */}
      <div style={{ marginTop: "2em" }}>
        <h3>Your Scheduled Lessons</h3>
        {user.teachers.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul className="card-list">
            {user.teachers.map((teacher) => (
              <li key={teacher.id} className="card">
                <h4>{teacher.name}</h4>
                <ul>
                  {teacher.appointments
                    .filter((appt) => appt.student_id === user.id)
                    .map((appt) => (
                      <li key={appt.id}>
                        {editingApptId === appt.id ? (
                          <>
                            <input
                              type="datetime-local"
                              value={newLessonTime}
                              onChange={(e) => setNewLessonTime(e.target.value)}
                            />
                            <button onClick={() => handleUpdate(appt.id)} style={{ marginLeft: "0.5em" }}>
                              Save
                            </button>
                            <button onClick={() => setEditingApptId(null)} style={{ marginLeft: "0.5em" }}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {new Date(appt.lesson_datetime).toLocaleString()}
                            <button
                              onClick={() => handleCancel(appt.id, teacher.id)}
                              style={{ marginLeft: "1em" }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setEditingApptId(appt.id);
                                setNewLessonTime(appt.lesson_datetime.slice(0, 16));
                              }}
                              style={{ marginLeft: "0.5em" }}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
