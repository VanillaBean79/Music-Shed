// Login.js
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then(err => Promise.reject(err));
      })
      .then((userData) => {
        setUser(userData);
        history.push("/my-appointments");
      })
      .catch((err) => alert(err.error || "Login failed"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <div>
        <label>Username:</label>
        <input name="username" value={formData.username} onChange={handleChange} />
      </div>
      <div>
        <label>Password:</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
