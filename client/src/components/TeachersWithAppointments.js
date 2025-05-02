import { useEffect, useState } from "react"


function TeachersWithAppointments() {
    const [ teachers, setTeachers ] = useState([])


    useEffect(()=> {
        fetch('/teachers')
        .then(res => res.json())
        .then(data => setTeachers(data))
    },[])

    return (
        <div>
          <h1>Teachers and Their Appointments</h1>
          {teachers.map(teacher => (
            <div key={teacher.id} style={{ border: '1px solid gray', margin: '1em', padding: '1em' }}>
              <h2>{teacher.name} (Age: {teacher.age})</h2>
              <h3>Appointments:</h3>
              <ul>
                {teacher.appointments.length > 0 ? teacher.appointments.map(app => (
                  <li key={app.id}>
                    Date: {new Date(app.lesson_datetime).toLocaleString()} with Student: {app.student.name}
                  </li>
                )) : <li>No appointments</li>}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    
    export default TeachersWithAppointments;