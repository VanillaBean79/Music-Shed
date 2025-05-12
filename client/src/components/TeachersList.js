import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // update path if needed

function TeachersList() {
  const { user, setUser } = useContext(UserContext);
  const [teachers, setTeachers] = useState([]);
  const [appointmentTimes, setAppointmentTimes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/teachers')
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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to book appointment.");
        return res.json();
      })
      .then((newAppt) => {
        alert("Appointment booked successfully!");
  
        const teacher = teachers.find((t) => t.id === newAppt.teacher_id);
  
        const updatedTeachers = [...user.teachers];
        const teacherIndex = updatedTeachers.findIndex((t) => t.id === teacher.id);
  
        if (teacherIndex !== -1) {
          updatedTeachers[teacherIndex].appointments.push(newAppt);
        } else {
          updatedTeachers.push({ ...teacher, appointments: [newAppt] });
        }
  
        setUser({ ...user, teachers: updatedTeachers });
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment");
      });
  };
  

  return (
    <div className="page-container">
      <h2>Available Teachers</h2>
      {teachers.length === 0 ? (
        <p>No teachers available at the moment.</p>
      ) : (
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher.id}>
              {teacher.name} (Age: {teacher.age})
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeachersList;
