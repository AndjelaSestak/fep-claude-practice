import api from "./api";

export const updateCurrentUser = async (userId, userData) => {
    try {
        const response = await api.patch(`/users/updateUserById/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
};

export const changePassword = async (userId, passwordData) => {
    try {
        const response = await api.patch(`/users/changePassword/${userId}`, passwordData);
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }   
}

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/deleteUserById/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

