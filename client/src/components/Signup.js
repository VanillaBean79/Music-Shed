import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import * as yup from "yup"

function Signup() {
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    name: yup.string().required("Name is required"),
    age: yup
      .number()
      .required("Age is required")
      .typeError("Age must be a number")
      .min(5, "Age must be at least 5"),
    instrument: yup.string().required("Instrument is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      name: "",
      age: "",
      instrument: "",
    },
    validationSchema,
    onSubmit: (values, {setSubmitting}) => {
      fetch('/signup', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      })
      .then((r)=> {
        if (r.ok){
          navigate("/login", {
            state: { message: "Please login to set an appointment with a teacher."},
          })
        } else {
          return r.json().then((data)=>{
            alert(data.error || "Signup failed")
          })
        }
      })
      .catch((err)=>{
        console.error("Signup error:", err)
        alert("Something went wrong.")
        setSubmitting(false)
      })
    }
  })

  return (
    <div className="page-container">
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        {["username", "password", "name", "age", "instrument"].map((field) => (
          <div key={field}>
            <label>{field[0].toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "password" ? "password" : field === "age" ? "number" : "text"}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
            />
            {formik.errors[field] && formik.touched[field] && (
              <p style={{ color: "red" }}>{formik.errors[field]}</p>
            )}
          </div>
        ))}
        <div>
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;