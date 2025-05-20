import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function NewTeacherForm({ teachers, setTeachers }) {
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    age: yup
      .number()
      .required("Age is required")
      .min(18, "Must be at least 18")
      .max(100, "Max age is 100")
      .typeError("Age must be a number"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          age: parseInt(values.age),
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((err) => {
              throw new Error(err.error || "Failed to create teacher.");
            });
          }
        })
        .then((newTeacher) => {
          alert("Teacher created!");
          setTeachers([...teachers, newTeacher]);
          resetForm();
        })
        .catch((err) => alert(err.message));
    },
  });

  return (
    <div style={{ marginTop: "2em" }}>
      <h3>Create a New Teacher</h3>
      <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1em", maxWidth: "300px" }}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <p style={{ color: "red", margin: 0 }}>{formik.errors.name}</p>}
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.age}
          />
          {formik.errors.age && <p style={{ color: "red", margin: 0 }}>{formik.errors.age}</p>}
        </div>

        <button type="submit">Add Teacher</button>
      </form>
    </div>
  );
}

export default NewTeacherForm;
