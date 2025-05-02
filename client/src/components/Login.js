import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Login ({ setUser }){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()


    function handleSubmit(e){
        e.preventDefault()

        fetch("/login", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
        .then((r)=> {
            if (r.ok) {
                r.json().then((user)=> {
                    setUser(user)
                    navigate("/dashboard")
                })
            } else {
                r.json().then((err)=> setError(err.error || "Login failed"))
            }
        })
    }

    return (
        <div className="page-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
        </div>
    )
}

export default Login