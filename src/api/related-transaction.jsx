import api from './index'

const BASE_URL = '/orders-tracking'

export default {
    getList(soNumber) {
        return api.get(`${BASE_URL}/transactions/${soNumber ? soNumber : ''}`)
    },

    orders(soNumber, page) {
        return api.get(`${BASE_URL}/states/${soNumber ? soNumber : ''}?page=${page}&limit=5`)
    },
}
