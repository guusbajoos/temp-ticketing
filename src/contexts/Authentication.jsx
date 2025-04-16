// contexts/Authentication.js
import { createContext, useContext, useState } from 'react'

const AuthenticationContext = createContext()

const AuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false)
    const [token, setToken] = useState(null)

    const login = (token) => {
        setAuthenticated(true)
        setToken(token)
    }

    const logout = () => {
        setAuthenticated(false)
        setToken(null)
    }

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

const useAuthentication = () => {
    return useContext(AuthenticationContext)
}

export { AuthenticationProvider, useAuthentication }
