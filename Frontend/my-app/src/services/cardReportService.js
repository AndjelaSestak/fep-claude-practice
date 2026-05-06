import api from "./api";

export const blockCard = async (cardId) => {
    try {
        const response = await api.patch(`/card_reports/${cardId}/block`);
        return response.data;
    } catch (error) {
        console.error("Error blocking card:", error);
        throw error;
    }
}

export const unblockCard = async (cardId) => {
    try {
        const response = await api.patch(`/card_reports/${cardId}/unblock`);
        return response.data;
    } catch (error) {
        console.error("Error unblocking card:", error);
        throw error;
    }
}

export const reportLostCard = async (cardId) => {
    try {
        const response = await api.patch(`/card_reports/${cardId}/report_lost`);
        return response.data;
    } catch (error) {
        console.error("Error reporting lost card:", error);
        throw error;
    }
}

export const reportStolenCard = async (cardId) => {
    try {
        const response = await api.patch(`/card_reports/${cardId}/report_stolen`);
        return response.data;
    } catch (error) {
        console.error("Error reporting stolen card:", error);
        throw error;
    }
}

export const getCardReports = async (cardId) => {
    try {
        const response = await api.get(`/card_reports/${cardId}/card_reports`);
        return response.data;
    } catch (error) {
        console.error("Error fetching card reports:", error);
        throw error;
    }
}
