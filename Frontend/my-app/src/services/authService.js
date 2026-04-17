import api from './api'

export const login = async (email, password) => {
    await api.post('/auth/login', { email, password })
}

export const logout = async () => {
    await api.post('/auth/logout')
}

export const getMe = async () => {
    const response = await api.get('/auth/me')
    return response.data
}

export const resetPassword = async ({ token, new_password, confirm_new_password }) => {
    const response = await api.post('/auth/reset-password', {
        token,
        new_password,
        confirm_new_password,
    })
    return response.data
}

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

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password_email', { email })
    return response.data
}


