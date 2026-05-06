import api from "./api";

export const getWalletBalance = async () => {
    try {
        const response = await api.get('/wallet/me/balance');
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        throw error;
    }
};

export const getCurrencies = async () => {
    try {
        const response = await api.get('/currency/currencies');
        return response.data;
    } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error;
    }
};

export const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await api.get('/currency/exchange_rate', {
            params: {
                from_currency: fromCurrency,
                to_currency: toCurrency,
            },
        });

        return response.data.exchange_rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        throw error;
    }
};
