import api from './index'

export default {
    getReportDashboard(param) {
        return api.get(`/reports/dashboard${param ? param : ''}`)
    },

    getReportDashboardByType(type, param) {
        return api.get(`/reports/dashboard/${type}?${param}`)
    },

    generateReport(query) {
        return api.get(`/reports/generate-report?${query}`)
    },
}
