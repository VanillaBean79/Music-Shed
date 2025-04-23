import React, { useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom';



function TeacherDashboard(){
    const [teachers, setTeachers] = useState([])
    const history = useHistory()

    useEffect(()=> {
        fetch("/teachers")
        .then((res)=> res.json())
        .then(setTeachers)
    }, [])

    function handleBook(teacherId) {
        history.push(`/appointments/new?teacher_id=${teacherId}`);
      }


    return (
        <div>
            <h2>Available Teachers</h2>
            <ul>
                {teachers.map((teacher)=> (
                    <li key={teacher.id}>
                        {teacher.name}, Age: {teacher.age}
                        <button onClick={() => handleBook(teacher.id)}>Book Lesson</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


export default TeacherDashboard