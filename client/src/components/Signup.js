import React, { useState } from "react"
import { useNavigate } from "react-router-dom"



function Signup(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [instrument, setInstrument] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()

        const ageInt = parseInt(age,10)

        if (isNaN(ageInt) || ageInt < 5) {
            setError("Age must be a nuber greater than 5.")
            return
        }

        const formData = {
            username,
            password,
            name,
            age: ageInt,
            instrument,
        }

        fetch('/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((r)=>{
            if (r.ok) {
                navigate("/teachers")
            } else {
                return r.json().then((data) => {
                    console.error(data.error)
                })
            }
        })
        .catch((error)=>{
            console.error("Error during signup:", error)
        })
    }


    return (
        <div>
            <h2>Signup</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required/>
                </div>

                <div>
                    <label>Name</label>
                    <input
                    type="name"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label>Age</label>
                    <input
                    type="age"
                    value={age}
                    onChange={(e)=> setAge(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label>Instrument</label>
                    <input
                    type="instrument"
                    value={instrument}
                    onChange={(e)=> setInstrument(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <button onClick={()=> navigate("/")}>Back to Home</button>
        </div>
    )
}


export default Signup