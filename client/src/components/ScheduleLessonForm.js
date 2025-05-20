import React from "react"
import { useFormik } from "formik"
import * as yup from "yup"



function ScheduleLessonForm({teachers, user, setUser }) {
    const validationSchema = yup.object().shape({
        teacher_id: yup.string().required("Please select a teacher."),
        lesson_datetime: yup
        .string()
        .required("Please select a lesson time"),
    })

    const formik = useFormik({
        initialValues: {
            teacher_id: "",
            lesson_datetime: "",
        },
        validationSchema,
        onSubmit: ( values, { resetForm })=> {
            fetch("/appointments", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    teacher_id: values.teacher_id,
                    student_id: user.id,
                    lesson_datetime: values.lesson_datetime,
                }),
            })
            .then((res)=>{
                if (!res.ok) throw new Error("Failed to schedule.")
                    return res.json()
            })
            .then((newAppt)=> {
                alert("Appointment scheduled!")


                const updatedTeachers = [...user.teachers]
                const teacherIndex = updatedTeachers.findIndex(t => t.id === newAppt.teacher_id)

                if (teacherIndex !== -1) {
                    updatedTeachers[teacherIndex].appointments.push(newAppt)
                } else {
                    const teacher = teachers.find(t => t.id === newAppt.teacher_id)
                    updatedTeachers.push({ ...teacher, appointments: [newAppt] })
                }

                setUser({ ...user, teachers: updatedTeachers })
                resetForm()
            })
            .catch((err)=> alert(err.message))
        }
    })


    return (
        <div style={{ marginTop: "2em"}}>
            <h3>Schedule a Lesson</h3>
            <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1em", maxWidth: "350px" }}>
                <div>
                    <label htmlFor="teacher_id">Teacher</label>
                    <select
                        id="teacher_id"
                        name="teacher_id"
                        value={formik.values.teacher_id}
                        onChange={formik.handleChange}
                        >
                            <option value="">Select a teacher</option>
                            {teachers.map((t)=>(
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        {formik.errors.teacher_id && <p style={{ color: "red"}}>{formik.errors.teacher_id}</p>}
                </div>

                <div>
                    <label htmlFor="lesson_datetime">Lesson Time</label>
                    <input
                        type="datetime-local"
                        id="lesson_datetime"
                        name="lesson_datetime"
                        value={formik.values.lesson_datetime}
                        onChange={formik.handleChange}
                        />
                        {formik.errors.lesson_datetime && <p style={{ color: "red" }}>{formik.errors.lesson_datetime}</p>}
                </div>

                <button type="submit">Schedule</button>
            </form>
        </div>
    )
}


export default ScheduleLessonForm