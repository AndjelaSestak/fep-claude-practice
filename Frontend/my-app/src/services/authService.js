import api from './api'

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },
    async verifyEmail(verificationData) {
        const response = await api.post('/auth/verify-email', verificationData)
        return response.data
    },
}


