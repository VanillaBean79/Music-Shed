import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2>Signup</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
          name: "",
          age: "",
          instrument: "",
        }}
        validate={(values) => {
          const errors = {};
          const ageInt = parseInt(values.age, 10);
          if (!values.username) errors.username = "Required";
          if (!values.password) errors.password = "Required";
          if (!values.name) errors.name = "Required";
          if (!values.instrument) errors.instrument = "Required";
          if (isNaN(ageInt) || ageInt < 5) errors.age = "Age must be at least 5";
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const formData = {
            ...values,
            age: parseInt(values.age, 10),
          };

          fetch("/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((r) => {
              setSubmitting(false);
              if (r.ok) {
                navigate("/login", {
                  state: {
                    message: "Please login to set an appointment with a teacher.",
                  },
                });
              } else {
                return r.json().then((data) => {
                  alert(data.error || "Signup failed");
                });
              }
            })
            .catch((err) => {
              console.error("Signup error:", err);
              alert("Something went wrong.");
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
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
              {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>

            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>

            <div>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={values.age}
                onChange={handleChange}
              />
              {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
            </div>

            <div>
              <label>Instrument</label>
              <input
                type="text"
                name="instrument"
                value={values.instrument}
                onChange={handleChange}
              />
              {errors.instrument && (
                <p style={{ color: "red" }}>{errors.instrument}</p>
              )}
            </div>

            <div>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
