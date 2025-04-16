import api from './index'

export default {
    getUserList(param) {
        return api.get(`/users${param ? param : ''}`)
    },

    getUserById(id) {
        return api.get(`/users/${id}`)
    },

    deleteUserList(payload) {
        return api.delete(`/users?id=${payload}`)
    },

    addUser(name, email, password, roles, teams) {
        return api.post(`/users`, {
            name: name,
            email: email,
            password: password,
            roles: [{ name: roles }],
            teams: [{ name: teams }],
        })
    },

    updateUser(id, name, email, password, isActive, roles, teams) {
        return api.put(`/users/${id}`, {
            name: name,
            email: email,
            password: password,
            isActive: isActive,
            roles: [{ name: roles }],
            teams: [{ name: teams }],
        })
    },

    updatePartialUser(id, name, email, password, isActive, roles) {
        return api.patch(`/users/${id}`, {
            name: name,
            email: email,
            password: password,
            isActive: isActive,
            roles: roles,
        })
    },

    /**
     * Save or update settings (it will replace the existing settings)
     * @param {String} userID userID
     * @param {object} settings object use from api/Settings func
     * @return {*}
     * @constructor
     */
    saveUserSettings(userID, settings) {
        return api.post(`/users/${userID}/settings`, {
            settings: JSON.stringify(settings),
        })
    },

    /**
     * Get settings by userID
     * @param {String} userID
     * @return {*}
     */
    getUserSettings(userID) {
        return api.get(`/users/${userID}/settings`)
    },
}
