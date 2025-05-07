import React, { useState, useEffect } from "react";

function StudentDashboard({ user }) {
  

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [lessonTime, setLessonTime] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [editingProfile, setEditingProfile] = useState(false);
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
  
    fetch("/teachers")
      .then((res) => res.json())
      .then(setTeachers);
  
    fetch(`/students/${user.id}/appointments`)
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []));
  }, [user]);
  

  if (!user) return <p>Loading student dashboard...</p>;


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
      .then((res) => {
        if (res.ok) {
          res.json().then((updatedUser) => {
            alert("Profile updated!");
            setEditingProfile(false);
          });
        } else {
          res.json().then((err) => alert(err.error || "Failed to update profile."));
        }
      });
  };

  const handleDeleteAccount = ()=> {
    if (!window.confirm("Are you sure you wnat to delete your account? This action cannot be undone.")){
      return
    }
    fetch(`/students/${user.id}`, {
      method: "DELETE",
    })
    .then((res)=> {
      if (res.ok) {
        alert("Account deleted.")
        window.location.href = "/"
      } else {
        res.json().then((err)=>
        alert(err.erro || "Failed to delete account."))
      }
    })
  }

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
            setAppointments((prev) => [...prev, newAppt]);
            setSelectedTeacherId("");
            setLessonTime("");
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
        setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
      } else {
        alert("Failed to cancel appointment.");
      }
    });
  };
  
  const appointmentsByTeacher = appointments.reduce((acc, appt) => {
    const teacherId = appt.teacher?.id;
    if (!teacherId) return acc;

    if (!acc[teacherId]) {
      acc[teacherId] = {
        teacher: appt.teacher,
        appointments: [],
      };
    }
    acc[teacherId].appointments.push(appt);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}!</h2>

      <div style={{ marginBottom: "2em" }}>
        <h3>Your Profile</h3>
        {editingProfile ? (
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profileForm.name}
              onChange={handleProfileChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={profileForm.age}
              onChange={handleProfileChange}
              style={{ marginLeft: "1em" }}
            />
            <input
              type="text"
              name="instrument"
              placeholder="Instrument"
              value={profileForm.instrument}
              onChange={handleProfileChange}
              style={{ marginLeft: "1em" }}
            />
            <button onClick={handleProfileSave} style={{ marginLeft: "1em" }}>
              Save
            </button>
            <button onClick={() => setEditingProfile(false)} style={{ marginLeft: "0.5em" }}>
              Cancel
            </button>
            <button
            onClick={handleDeleteAccount}
            style={{ marginLeft: "0.5em", backgroundColor: "red", color: "white"}}
            >
              Delete Account
            </button>
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

      <div>
        <h3>Schedule a Lesson</h3>
        <select
          value={selectedTeacherId}
          onChange={(e) => setSelectedTeacherId(e.target.value)}
        >
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

      <div style={{ marginTop: "2em" }}>
        <h3>Your Scheduled Lessons</h3>
        {Object.keys(appointmentsByTeacher).length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul className="card-list">
            {Object.values(appointmentsByTeacher).map(({ teacher, appointments }) => (
              <li key={teacher.id} className="card">
                <h4>{teacher.name}</h4>
                <ul>
                  {appointments.map((appt) => (
                    <li key={appt.id} style={{ marginBottom: "0.5em" }}>
                      {new Date(appt.lesson_datetime).toLocaleString()}
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="delete-button"
                        style={{ marginLeft: "1em" }}
                      >
                        Cancel
                      </button>
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
