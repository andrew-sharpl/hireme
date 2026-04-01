import { createContext, useContext, useState } from "react";

interface User {
  token: string;
  username: string;
  email: string;
  role: "Poster" | "Viewer";
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

/*
Creates a context object that holds use auth data that can be used 
by any component in app, without having to pass it through components.
Initialized to null until a user is logged in.
*/
const AuthContext = createContext<AuthContextType | null>(null);

/*
A container for the auth state that makes it available to any children components.
The entire app gets wrapped in <AuthProvider> so that every page and component
can support JWT authentication.
*/
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /*
  User data is lazily initialized so that it does not read from
  local storage on every render, just on load.
  */
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("hireme_user");
    return stored ? JSON.parse(stored) : null;
  });

  // Stores user information in local storage upon login.
  function login(userData: User) {
    localStorage.setItem("hireme_user", JSON.stringify(userData));
    setUser(userData);
  }

  // Removes user information from local storage when logging out.
  function logout() {
    localStorage.removeItem("hireme_user");
    setUser(null);
  }

  /*
  Pushes user data into the context. Makes value accessible to children components
  which includes user data, and login/logout functions.
  */
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to create auth context and check for errors.
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
