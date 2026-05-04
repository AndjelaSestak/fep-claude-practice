import api from "./api";

export const deactivateRecurringTransaction = async (recurringTransactionId) => {
    try {
        const response = await api.patch(`/recurring-transactions/${recurringTransactionId}/cancel`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling recurring transaction:", error);
        throw error;
    }
};

export const activateRecurringTransaction = async (recurringTransactionId) => {
    try {
        const response = await api.patch(`/recurring-transactions/${recurringTransactionId}/activate`);
        return response.data;
    } catch (error) {
        console.error("Error activating recurring transaction:", error);
        throw error;
    }
};
