import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom"

function StudentDashboard() {
  const { user, teachers, setUser, setTeachers, loading } = useContext(UserContext);

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

  const [newTeacherForm, setNewTeacherForm] = useState({ name: "", age: ""})
  const navigate = useNavigate()

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
        navigate("/");
        // navigate will prevent an unnecessary page reload. 
      } else {
        alert("Failed to delete account.");
      }
    });
  };

  const handleSchedule = () => {
    // VALIDATION: Ensures that both selected teacher and lesson time are set.
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
  
            // Find teacher
            const updatedTeachers = [...user.teachers];
            const teacherIndex = updatedTeachers.findIndex((t) => t.id === newAppt.teacher_id);
            
            if (teacherIndex !== -1) {
              updatedTeachers[teacherIndex].appointments.push(newAppt);
            } else {
              // If teacher not in user's list yet, add them
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
    .then((res)=>{
      if (!res.ok) throw new Error("Failed to cancel appoinment")
        return res.json()
    })
    .then(()=>{
      alert("Appointment cancelled!")

      
      const updatedTeachers = [...user.teachers]
      const teacherIndex = updatedTeachers.findIndex((t)=> t.id === teacherId)
      // const updatedTeacher = updatedTeachers.find((t)=> t.id === teacherId)
      // if (updatedTeacher) {
      // updatedTeacher.appointments = updatedTeacher.appointments.filter((appt)=> appt.id !== appointmentId)
      // const updatedTeachers = user.teachers.map((t)=> t.id === teacherId ? updatedTeacher : t)
      // }
      if (teacherIndex !== -1) {
        updatedTeachers[teacherIndex].appointments = 
        updatedTeachers[teacherIndex].appointments.filter((appt)=> appt.id !== appointmentId)
        
      }

      const cleanedTeachers = updatedTeachers.filter((t)=> t.appointments && 
    t.appointments.length > 0)
      setUser({...user, teachers: cleanedTeachers })
    })
    .catch((err)=> {
      console.error("Cancel error:", err)
      alert("Failed to cancel appointment")
    })
  }
  

  const handleUpdate = (appointmentId) => {
    if (!newLessonTime) return alert("Please choose a new time.")

      fetch(`/appointments/${appointmentId}`, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({ lesson_datetime: newLessonTime }),
      })
      .then((res)=>{
        if (!res.ok) throw new Error("Update failed.")
          return res.json()
      })
      .then((updatedAppt)=>{
        alert("Appointment updated!")

        const updatedTeachers = [...user.teachers]
        const teacherIndex = updatedTeachers.findIndex((t) => t.id === updatedAppt.teacher_id)

        if (teacherIndex !== -1) {

          updatedTeachers[teacherIndex].appointments = 
          updatedTeachers[teacherIndex].appointments.map((appt)=>
            appt === updatedAppt.id ? updatedAppt : appt
          )
        }

        setUser({...user, teachers: updatedTeachers })

        // Clear editing state
        setEditingApptId(null)
      })
      .catch((error)=>{
        console.error("Error updating appointment", error)
        alert("Appointment not updated.")
      })
  };


  const handleCreateTeacher = ()=>{
    if (!newTeacherForm.name || !newTeacherForm.age) 
      return alert("Please fill out both fields.")

    fetch("/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        name: newTeacherForm.name,
        age: parseInt(newTeacherForm.age),
      }),
    })
    .then((res)=>{
      if (res.ok) {
        res.json().then((newTeacher)=> {
          alert("Teacher created!")
          setNewTeacherForm({ name:"", age: ""})

          setTeachers([...teachers, newTeacher])
        })
      } else {
        res.json().then((err)=> alert(err.error)|| "Failed to create teacher.")
      }
    })
  }

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

      <div style={{ marginTop: "2em"}}>
        <h3>Create a New Teacher</h3>
        <input
        type="text"
        placeholder="Name"
        value={newTeacherForm.name}
        onChange={(e)=> setNewTeacherForm({...newTeacherForm, name: e.target.value})}/>
        <input
        type="number"
        placeholder="Age"
        value={newTeacherForm.age}
        onChange={(e)=> setNewTeacherForm({...newTeacherForm, age: e.target.value})}
        style={{ marginLeft: "1em"}}
        />
        <button onClick={handleCreateTeacher} style={{ marginLeft:"1em"}}>
          Add Teacher
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
                            <button onClick={() => handleCancel(appt.id, teacher.id)} style={{ marginLeft: "1em" }}>
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
