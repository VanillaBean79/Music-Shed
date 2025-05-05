import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeachersList({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [appointmentTimes, setAppointmentTimes] = useState({});
  const [visibleAppointments, setVisibleAppointments] = useState({});
  const [appointmentsByTeacher, setAppointmentsByTeacher] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/teachers")
      .then((r) => r.json())
      .then((data) => setTeachers(data));
  }, []);

  const handleDateTimeChange = (teacherId, value) => {
    setAppointmentTimes((prev) => ({
      ...prev,
      [teacherId]: value,
    }));
  };

  const handleBookAppointment = (teacherId) => {
    const studentId = user?.id;
    const selectedTime = appointmentTimes[teacherId];

    if (!studentId) {
      alert("You must be logged in to book an appointment.");
      return;
    }

    if (!selectedTime) {
      alert("Please choose a date and time.");
      return;
    }

    const appointmentData = {
      student_id: studentId,
      teacher_id: teacherId,
      lesson_datetime: new Date(selectedTime).toISOString(),
    };

    fetch("/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((r) => {
        if (r.ok) {
          alert("Appointment booked successfully!");
          // Optionally reload appointments for that teacher
          fetchTeacherAppointments(teacherId);
        } else {
          alert("Failed to book appointment.");
        }
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment");
      });
  };

  const fetchTeacherAppointments = (teacherId) => {
    fetch(`/teachers/${teacherId}/appointments`)
      .then((r) => r.json())
      .then((data) => {
        setAppointmentsByTeacher((prev) => ({
          ...prev,
          [teacherId]: data,
        }));
      });
  };

  const toggleAppointments = (teacherId) => {
    const currentlyVisible = visibleAppointments[teacherId];

    setVisibleAppointments((prev) => ({
      ...prev,
      [teacherId]: !currentlyVisible,
    }));

    if (!currentlyVisible && !appointmentsByTeacher[teacherId]) {
      fetchTeacherAppointments(teacherId);
    }
  };

  return (
    <div className="page-container">
      <h2>Available Teachers</h2>
      {teachers.length === 0 ? (
        <p>No teachers available at the moment.</p>
      ) : (
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher.id} style={{ marginBottom: "2rem" }}>
              <strong>{teacher.name}</strong> (Age: {teacher.age})
              <div>
                <input
                  type="datetime-local"
                  value={appointmentTimes[teacher.id] || ""}
                  onChange={(e) => handleDateTimeChange(teacher.id, e.target.value)}
                />
                <button onClick={() => handleBookAppointment(teacher.id)}>
                  Book Appointment
                </button>
              </div>

              <button onClick={() => toggleAppointments(teacher.id)} style={{ marginTop: "0.5rem" }}>
                {visibleAppointments[teacher.id] ? "Hide Appointments" : "Show Appointments"}
              </button>

              {visibleAppointments[teacher.id] && (
                <ul>
                  {(appointmentsByTeacher[teacher.id] || []).map((appt) => (
                    <li key={appt.id}>
                      {new Date(appt.lesson_datetime).toLocaleString()} — Student:{" "}
                      {appt.student?.name || "Unknown"}
                    </li>
                  ))}
                  {(appointmentsByTeacher[teacher.id]?.length === 0) && (
                    <li>No appointments scheduled.</li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeachersList;
