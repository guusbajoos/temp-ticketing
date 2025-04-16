import api from './index'

export default {
    getTeamList(param) {
        return api.get(`/teams${param ? param : ''}`)
    },

    getTeamById(id) {
        return api.get(`/teams/${id}`)
    },

    deleteTeamList(id) {
        return api.delete(`/teams?id=${id}`)
    },

    updateTeam(id, name) {
        return api.put(`/teams/${id}`, {
            name: name,
        })
    },

    addTeam(name) {
        return api.post(`/teams`, {
            name: name,
        })
    },
}
