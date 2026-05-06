import api from './api'

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    } catch (error) {
        console.error("Error logging in:", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        return response.data
    } catch (error) {
        console.error("Error logging out:", error)
        throw error
    }
}

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me')
        return response.data
    } catch (error) {
        console.error("Error fetching current user:", error)
        throw error
    }
}

export const resetPassword = async ({ token, new_password, confirm_new_password }) => {
    try {
        const response = await api.post('/auth/reset_password', {
            token,
            new_password,
            confirm_new_password,
        })
        return response.data
    } catch (error) {
        console.error("Error resetting password:", error)
        throw error
    }
}

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData)
        return response.data
    } catch (error) {
        console.error("Error registering user:", error)
        throw error
    }
}

export const verifyEmail = async (verificationData) => {
    try {
        const response = await api.post('/auth/verify_email', verificationData)
        return response.data
    } catch (error) {
        console.error("Error verifying email:", error)
        throw error
    }
}

export const resendVerificationEmail = async (email) => {
    try {
        const response = await api.post('/auth/resend_verification_email', { email })
        return response.data
    } catch (error) {
        console.error("Error resending verification email:", error)
        throw error
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot_password_email', { email })
        return response.data
    } catch (error) {
        console.error("Error sending forgot password email:", error)
        throw error
    }
}
