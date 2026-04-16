import api from './api.js'

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    }
}