import React from 'react'
import { Navigate, Route } from 'react-router-dom'
import { useAuthentication } from 'contexts/Authentication'

const AuthenticatedGuardRoute = ({ element, ...rest }) => {
    const { isAuthenticated } = useAuthentication()

    return isAuthenticated ? (
        <Route {...rest} element={element} />
    ) : (
        <Navigate to="/login" replace />
    )
}

export default AuthenticatedGuardRoute
