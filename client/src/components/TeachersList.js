import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

function TeachersList({ user }) {
    const [teachers, setTeachers] = useState([])
    const [error, setError] = useState(null)
    const [appointmentTimes, setAppointmentTimes] = useState({}) // 🔥 tracks time per teacher
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/teachers')
            .then((r) => r.json())
            .then((data) => setTeachers(data))
    }, [])

    const handleDateTimeChange = (teacherId, value) => {
        setAppointmentTimes((prev) => ({
            ...prev,
            [teacherId]: value,
        }))
    }

    const handleBookAppointment = (teacherId) => {
        const studentId = user?.id
        const selectedTime = appointmentTimes[teacherId]

        if (!studentId) {
            alert("You must be logged in to book an appointment.")
            return
        }

        if (!selectedTime) {
            alert("Please choose a date and time.")
            return
        }

        const appointmentData = {
            student_id: studentId,
            teacher_id: teacherId,
            lesson_datetime: new Date(selectedTime).toISOString(),
        }

        fetch("/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
        })
            .then((r) => {
                if (r.ok) {
                    alert("Appointment booked successfully!")
                } else {
                    alert("Failed to book appointment.")
                }
            })
            .catch((error) => {
                console.error("Error booking appointment:", error)
                alert("Error booking appointment")
            })
    }

    return (
        <div>
            <h2>Available Teachers</h2>
            <button onClick={()=> navigate("/")}>Back to Home</button>
            {error && <p>{error}</p>}
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
    )
}

export default TeachersList
