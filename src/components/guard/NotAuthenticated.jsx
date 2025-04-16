// components/guard/NotAuthenticated.js
import React from 'react'
import { Navigate, Route } from 'react-router-dom'
import { useAuthentication } from 'contexts/Authentication'

const NotAuthenticatedGuardRoute = ({ element, ...rest }) => {
    const { isAuthenticated } = useAuthentication()

    return isAuthenticated ? (
        <Navigate to="/" replace />
    ) : (
        <Route {...rest} element={element} />
    )
}

export default NotAuthenticatedGuardRoute
