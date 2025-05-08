import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

function StudentDashboard() {
  const { user, teachers, setUser, loading } = useContext(UserContext);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [lessonTime, setLessonTime] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);

  const [editingApptId, setEditingApptId] = useState(null);
  const [newLessonTime, setNewLessonTime] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    age: "",
    instrument: "",
  });

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name,
      age: user.age,
      instrument: user.instrument,
    });
  }, [user]);

  if (loading || !user) return <p>Loading student dashboard...</p>;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || "" : value,
    }));
  };

  const handleProfileSave = () => {
    fetch(`/students/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    })
      .then((res) =>
        res.ok
          ? res.json().then((data) => {
              alert("Profile updated!");
              setUser(data);
              setEditingProfile(false);
            })
          : res.json().then((err) => alert(err.error || "Failed to update profile."))
      );
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    fetch(`/students/${user.id}`, { method: "DELETE" }).then((res) => {
      if (res.ok) {
        alert("Account deleted.");
        window.location.href = "/";
      } else {
        alert("Failed to delete account.");
      }
    });
  };

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
    }).then((res) => {
      if (res.ok) {
        res.json().then(() => {
          alert("Appointment scheduled!");
          window.location.reload();
        });
      } else {
        res.json().then((err) => alert(err.error || "Failed to schedule."));
      }
    });
  };

  const handleCancel = (appointmentId) => {
    fetch(`/appointments/${appointmentId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        alert("Appointment cancelled.");
        window.location.reload();
      } else {
        alert("Failed to cancel appointment.");
      }
    });
  };

  const handleUpdate = (appointmentId) => {
    if (!newLessonTime) return alert("Please choose a new time");

    fetch(`/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson_datetime: newLessonTime }),
    }).then((res) => {
      if (res.ok) {
        alert("Appointment updated.");
        window.location.reload();
      } else {
        res.json().then((err) => alert(err.error || "Update failed."));
      }
    });
  };

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}!</h2>

      {/* Profile Section */}
      <div style={{ marginBottom: "2em" }}>
        <h3>Your Profile</h3>
        {editingProfile ? (
          <div>
            <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} />
            <input type="number" name="age" value={profileForm.age} onChange={handleProfileChange} style={{ marginLeft: "1em" }} />
            <input type="text" name="instrument" value={profileForm.instrument} onChange={handleProfileChange} style={{ marginLeft: "1em" }} />
            <button onClick={handleProfileSave} style={{ marginLeft: "1em" }}>Save</button>
            <button onClick={() => setEditingProfile(false)} style={{ marginLeft: "0.5em" }}>Cancel</button>
            <button onClick={handleDeleteAccount} style={{ marginLeft: "0.5em", backgroundColor: "red", color: "white" }}>Delete Account</button>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Instrument:</strong> {user.instrument}</p>
            <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      {/* Schedule a Lesson */}
      <div>
        <h3>Schedule a Lesson</h3>
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
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

      {/* Appointments by Teacher */}
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
                            <button onClick={() => handleCancel(appt.id)} style={{ marginLeft: "1em" }}>
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
