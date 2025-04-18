import React, { useState } from "react"


function NewStudentForm() {
    const [ formData, setFormData] = useState({
        name: "",
        age: "",
        instrument:"",
    })



function handleChange(e) {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }))
}


function handleSubmit(e) {
    e.preventDefault()

    fetch("http://localhost:5555/students", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
    })
    .then((r)=> {
        if (r.ok) return r.json()
            throw new Error("Failed to add student.")
    })
    .then((newStudent) => {
        console.log("New student added:", newStudent)
        setFormData({ name: "", age: "", instrument: ""})
    })
    .catch((error) => {
        console.error("Error:", error)
    })
}


return (
    <form onSubmit={handleSubmit}>
      <h2>Student Registration</h2>

      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <br />

      <label>Age:</label>
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        required
      />

      <br />

      <label>Instrument:</label>
      <input
        type="text"
        name="instrument"
        value={formData.instrument}
        onChange={handleChange}
        required
      />

      <br />

      <button type="submit">Submit</button>
    </form>
  );
}







export default NewStudentForm