import React, { useState } from "react"


function Signup({onSignup}) {
  const [ formData, setFormData] = useState({
    username:"",
    password:"",
    name:"",
    age:"",
    instrument:""
  })

  function handleChange(e) {
    setFormData({...formData, [e.target.name]: e.target.value})
  }


  function handleSubmit(e) {
    e.preventDefault()
    fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "apllication/json"},
      body: JSON.stringify(formData),
    })
    .then((r)=> {
      if (r.ok) return r.json().then(onSignup)
        else return r.json().then((err)=>alert(err.error))
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={handleChange}/>
      <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
      <input name="name" placeholder="Full Name" onChange={handleChange}/>
      <input age="age" placeholder="Age" onChange={handleChange}/>
      <input name="instrument" placeholder="Instrument" onChange={handleChange}/>
      <button type="submit">Register</button> 
    </form>
  )

}
    
    export default Signup;