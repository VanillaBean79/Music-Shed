import React, { useEffect, useState} from "react"
import { useHistory } from "react-router-dom"


function TeacherList() {
    const [ teachers, setTeachers] = useState([])
    const history = useHistory()


    useEffect(()=>{
        fetch('/teachers')
        .then((res)=> res.json())
        .then(setTeachers)
    }, [])

    function handleBook(teacherId) {
        history.push(`/book?teacher_id=${teacherId}`)
    }


    return (
        <div>
            <h2>Available teachers</h2>
            <ul>
                {teachers.map((t)=> (
                    <li key={t.id}>
                        {t.name} - Age {t.age}
                        <button onClick={()=> handleBook(t.id)}>Book Lesson</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TeacherList