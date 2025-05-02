import { NavLink, useNavigate } from "react-router-dom"


function NavBar({ user, setUser }) {
    const navigate = useNavigate()


    function handleLogout(){
        fetch("/logout", { method: "DELETE"})
        .then(()=> {
            setUser(null)
            navigate('/')
        })
    }

    return (
        <nav style={{ padding: "1em", borderBottom: "1px solid #ccc" }}>
          <NavLink to="/" style={{ marginRight: "1em" }}>Home</NavLink>
          <NavLink to="/teachers" style={{ marginRight: "1em" }}>Teachers</NavLink>
          {user ? (
            <>
              <NavLink to="/my-appointments" style={{ marginRight: "1em" }}>My Appointments</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/signup" style={{ marginRight: "1em" }}>Signup</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </nav>
      );
    }
    
    export default NavBar;