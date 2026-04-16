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
