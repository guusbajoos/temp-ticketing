// auth.js
import axios from 'axios'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.status === 401 && window.location.pathname !== "/") {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default api
