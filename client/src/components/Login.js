import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useFormik } from "formik"
import * as yup from "yup"

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || ""

  const fromSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required."),
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: fromSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      fetch("/login",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      })
      .then((res)=>{
        if (res.ok) {
          return res.json().then((user)=> {
            setUser(user)
            navigate("/dashboard")
          })
        } else {
          return res.json().then((err)=>{
            setErrors({ password: err.error || "Login failed"})
          })
        }
      })
      .catch(()=> {
        setErrors({ password: "Network error. Please try again."})
      })
      .finally(()=>{
        setSubmitting(false)
      })
    },
  })

  return (
    <div className="page-container">
      <h2>Login</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.errors.username && (
            <p style={{ color: "red" }}>{formik.errors.username}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && (
            <p style={{ color: "red" }}>{formik.errors.password}</p>
          )}
        </div>

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
