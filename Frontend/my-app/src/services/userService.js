import api from './api'

export const updateCurrentUser = async (userData) => {
  try {
    const response = await api.patch('/users/me', userData)
    return response.data
  } catch (error) {
    console.error('Error updating user data:', error)
    throw error
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch('/users/me/password', passwordData)
    return response.data
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

export const deleteUser = async () => {
  try {
    const response = await api.delete('/users/me')
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
