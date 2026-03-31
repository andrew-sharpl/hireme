import { createContext, useContext, useState } from 'react'

interface User {
    token: string
    username: string
    email: string 
    role: 'Poster' | 'Viewer'
}

interface AuthContextType {
    user: User | null 
    login: (userData: User) => void 
    logout: () => void
}

/*
Creates a context that allows User information, and importantly their JWT
token to be available to all children components, removing the need for 
passing information through every component later.
*/
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Initializes User state from local storage to persist through refreshing.
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('hireme_user')
        return stored ? JSON.parse(stored) : null
    })

    // Stores user information in local storage upon login.
    function login(userData: User) {
        localStorage.setItem('hireme_user', JSON.stringify(userData))
        setUser(userData)
    }

    // Removes user information from local storage when logging out.
    function logout() {
        localStorage.removeItem('hireme_user')
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
