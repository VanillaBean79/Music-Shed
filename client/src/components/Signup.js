import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  // State for form fields
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    instrument: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    instrument: "",
  });

  // State for form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const ageInt = parseInt(formValues.age, 10);
    let formErrors = { username: "", password: "", name: "", instrument: "", age: "" };

    if (!formValues.username) formErrors.username = "Required";
    if (!formValues.password) formErrors.password = "Required";
    if (!formValues.name) formErrors.name = "Required";
    if (!formValues.instrument) formErrors.instrument = "Required";
    if (isNaN(ageInt) || ageInt < 5) formErrors.age = "Age must be at least 5";

    setErrors(formErrors);

    // If there are no errors, submit the form
    if (!Object.values(formErrors).some((error) => error)) {
      setIsSubmitting(true);
      const formData = { ...formValues, age: parseInt(formValues.age, 10) };

      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((r) => {
          setIsSubmitting(false);
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
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="page-container">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formValues.age}
            onChange={handleChange}
          />
          {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
        </div>

        <div>
          <label>Instrument</label>
          <input
            type="text"
            name="instrument"
            value={formValues.instrument}
            onChange={handleChange}
          />
          {errors.instrument && <p style={{ color: "red" }}>{errors.instrument}</p>}
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
