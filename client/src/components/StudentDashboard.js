import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const { user, teachers, setUser, setTeachers, loading } = useContext(UserContext);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [lessonTime, setLessonTime] = useState("");
  const [editingApptId, setEditingApptId] = useState(null);
  const [newLessonTime, setNewLessonTime] = useState("");
  const [newTeacherForm, setNewTeacherForm] = useState({ name: "", age: "" });

  const navigate = useNavigate();

  if (loading || !user) return <p>Loading student dashboard...</p>;

  const handleSchedule = () => {
    if (!selectedTeacherId || !lessonTime) return alert("Please fill out all fields.");
    fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_id: selectedTeacherId,
        student_id: user.id,
        lesson_datetime: lessonTime,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((newAppt) => {
            alert("Appointment scheduled!");
            const updatedTeachers = [...user.teachers];
            const teacherIndex = updatedTeachers.findIndex((t) => t.id === newAppt.teacher_id);

            if (teacherIndex !== -1) {
              updatedTeachers[teacherIndex].appointments.push(newAppt);
            } else {
              const teacher = teachers.find((t) => t.id === newAppt.teacher_id);
              updatedTeachers.push({ ...teacher, appointments: [newAppt] });
            }

            setUser({ ...user, teachers: updatedTeachers });
            setSelectedTeacherId("");
            setLessonTime("");
          });
        } else {
          res.json().then((err) => alert(err.error || "Failed to schedule."));
        }
      });
  };

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

        const cleanedTeachers = updatedTeachers.filter((t) => t.appointments && t.appointments.length > 0);
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

  const handleCreateTeacher = () => {
    if (!newTeacherForm.name || !newTeacherForm.age) return alert("Please fill out both fields.");

    fetch("/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTeacherForm.name,
        age: parseInt(newTeacherForm.age),
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((newTeacher) => {
            alert("Teacher created!");
            setNewTeacherForm({ name: "", age: "" });
            setTeachers([...teachers, newTeacher]);
          });
        } else {
          res.json().then((err) => alert(err.error || "Failed to create teacher."));
        }
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
      <div>
        <h3>Schedule a Lesson</h3>
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={lessonTime}
          onChange={(e) => setLessonTime(e.target.value)}
          style={{ marginLeft: "1em" }}
        />
        <button onClick={handleSchedule} style={{ marginLeft: "1em" }}>
          Schedule
        </button>
      </div>

      {/* Create a New Teacher */}
      <div style={{ marginTop: "2em" }}>
        <h3>Create a New Teacher</h3>
        <input
          type="text"
          placeholder="Name"
          value={newTeacherForm.name}
          onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newTeacherForm.age}
          onChange={(e) => setNewTeacherForm({ ...newTeacherForm, age: e.target.value })}
          style={{ marginLeft: "1em" }}
        />
        <button onClick={handleCreateTeacher} style={{ marginLeft: "1em" }}>
          Add Teacher
        </button>
      </div>

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
