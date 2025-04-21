import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [ student, setStudent] = useState(null)



useEffect(()=> {
    fetch('/check_session')
    .then((r)=> {
        if (r.ok) r.json().then(setStudent)
    })
}, [])

return (
    <AuthContext.Provider value={{ student, setStudent }}>
        {children}
    </AuthContext.Provider>
)
}
