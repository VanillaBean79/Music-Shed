import React from "react"
import { useFormik } from "formik"
import * as yup from "yup"


function NewTeacherForm({teachers, setTeachers }) {
    const formSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        age: yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(18, "Teacher must be at least 18")
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            age: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm })=> {
            fetch("/teachers", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: values.name,
                    age: parseInt(values.age),
                }),
            })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    return res.json().then((err)=> {
                        throw new Error(err.error || "Failed to create teacher.")
                    })
                }
            })
            .then((newTeacher)=>{
                setTeachers([...teachers, newTeacher])
                alert("Teaher created!")
                resetForm()
            })
            .catch((err) => {
                alert(err.message)
            })
        }
    })

    return (
        <div style={{ marginTop: "2em "}}>
            <h3>Create a New Teacher</h3>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        />
                        {formik.errors.name && (
                            <p style={{ color: "red"}}>{formik.errors.name}</p>
                        )}
                </div>

                <div>
                    <label>Age</label>
                    <input
                        name="age"
                        type="number"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        />
                        {formik.errors.age && (
                            <p style={{ color: "red"}}>{formik.errors.age}</p>
                        )}
                </div>

                <button type="submit" style={{ marginTop: "1em"}}>
                    Add Teacher
                </button>
            </form>
        </div>
    )
}

export default NewTeacherForm