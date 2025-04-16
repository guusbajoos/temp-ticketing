import api from './index'

export default {
    login(payload) {
        return api.post(`/auth/signin`, payload)
    },

    refreshToken(payload) {
        return api.post(`/auth/refresh`, payload)
    },

    changePassword(payload) {
        return api.post(`/auth/change-password`, payload)
    },
}
