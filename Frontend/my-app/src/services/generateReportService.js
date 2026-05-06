import api from "./api";

export const exportTransactions = async (format, search, type, direction, period) => {
    try {
        const params = {};
        if (search) params.search = search;
        if (type) params.type = type;
        if (direction) params.direction = direction;
        if (period) params.period = period;

        const endpoint = format === 'csv' ? '/generate_report/export/csv' : '/generate_report/export/pdf';

        const response = await api.get(endpoint, {
            params,
            responseType: 'blob'
        });

        return response.data;
    } catch (error) {
        console.error("Error exporting transactions:", error);
        throw error;
    }
};
