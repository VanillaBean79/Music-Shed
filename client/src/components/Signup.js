import React, { useState } from "react"
import { useHistory } from "react-router-dom"

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        age: "",
        instrument: "",
        password: ""
    })
    const history = useHistory()

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        const formDataToSend = {
            ...formData,
            age: parseInt(formData.age)
        }
        fetch("/signup",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(formDataToSend)
        })
        .then(res => {
            if (res.ok) return res.json()
                return res.json().then(err => Promise.reject(err))
        })
        .then(()=> history.push("/teachers"))
        .catch(err => alert(err.erro || "Signup failld"))
    }


    return (
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          {["username", "name", "age", "instrument", "password"].map(field => (
            <div key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Register</button>
        </form>
      );
    }
    
    export default Signup;