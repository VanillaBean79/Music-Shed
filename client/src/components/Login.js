import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import { UserContext } from "./UserContext";

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "";

  return (
    <div className="page-container">
      <h2>Login</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.username) errors.username = "Username is required";
          if (!values.password) errors.password = "Password is required";
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((r) => {
              if (r.ok) {
                return r.json().then((user) => {
                  setUser(user);
                  navigate("/dashboard");
                });
              } else {
                return r.json().then((err) => {
                  setErrors({ password: err.error || "Login failed" });
                });
              }
            })
            .catch(() => {
              setErrors({ password: "Network error. Please try again." });
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
              />
              {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}>Login</button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
