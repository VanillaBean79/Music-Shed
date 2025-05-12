import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session user
    fetch("/check_session")
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => setUser(data));
        }
      })
      .catch(console.error);

    // Fetch teachers list
    fetch("/teachers")
      .then((res) => res.json())
      .then(setTeachers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, teachers, setTeachers, loading }}>
      {children}
    </UserContext.Provider>
  );
}
