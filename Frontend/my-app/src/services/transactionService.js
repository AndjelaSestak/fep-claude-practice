import api from "./api";

export const getSupportedCurrencies = async () => {
    try {
        const response = await api.get('/transactions/currencies');
        return response.data;
    } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error;
    }
};

export const createTransaction = async (data) => {
    try {
        const response = await api.post('/transactions', data);
        return response.data;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};

export const cancelTransaction = async (transactionId) => {
    try {
        const response = await api.delete(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling transaction:", error);
        throw error;
    }
};

export const getTransactionsForUser = async (search, limit, offset) => {
    try {
        const params = {};
        if (search) params.search = search;
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        const response = await api.get('/transactions/all', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};