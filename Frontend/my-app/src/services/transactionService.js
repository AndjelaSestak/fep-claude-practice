import api from "./api";

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

export const getTransactionById = async (transactionId) => {
    try {
        const response = await api.get(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transaction with ID ${transactionId}:`, error);
        throw error;
    }
};