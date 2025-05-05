import { NavLink, useNavigate } from "react-router-dom";

function NavBar({ user, handleLogout }) {
  const navigate = useNavigate();
  

  return (
    <nav style={{ padding: "1em", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/" style={{ marginRight: "1em" }}>Home</NavLink> {/* Teachers list on "/" */}
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
