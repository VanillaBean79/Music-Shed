import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


function MyAppointments({user}){
    const [appointments, setAppointments] = useState([])
    const navigate = useNavigate()

    
    useEffect(()=> {
        if (user?.id) {
            fetch(`/students/${user.id}/appointments`)
            .then((r)=> r.json())
            .then(setAppointments)
        }
    },[user])


    return(
        <div>
            <h2>My Appointments</h2>
            <button onClick={()=> navigate("/")}>Back to Home</button>
            {appointments.length === 0 ? (
                <p>No appointments found</p>
            ):(
                <ul>
                    {appointments.map((appt)=> (
                        <li key={appt.id}>
                            {appt.teacher.name} - {new Date(appt.lesson_datetime).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MyAppointments


