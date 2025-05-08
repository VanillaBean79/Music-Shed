import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    fetch("/logout", {
      method: "DELETE",
    }).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  return (
    <nav style={{ padding: "1em", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/" style={{ marginRight: "1em" }}>Home</NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" style={{ marginRight: "1em" }}>Dashboard</NavLink>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/signup" style={{ marginRight: "1em" }}>Create Account</NavLink>
          <NavLink to="/login">Login</NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;

