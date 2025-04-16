import api from './index'

export default {
    getRoleList(param) {
        return api.get(`/roles${param ? param : ''}`)
    },

    getRoleById(id) {
        return api.get(`/roles/${id}`)
    },

    deleteRoleList(id) {
        return api.delete(`/roles?id=${id}`)
    },

    updateRole(id, name, privileges, teams) {
        return api.put(`/roles/${id}`, {
            name: name,
            privileges: privileges,
            teams: teams,
        })
    },

    addRole(name, privileges, teams) {
        return api.post(`/roles`, {
            name: name,
            privileges: privileges,
            teams: teams,
        })
    },

    getByTeam(teamId) {
        return api.get(`roles/teams/${teamId}`)
    },
}
