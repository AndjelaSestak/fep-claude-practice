import api from "./api";

// CREATE CARD
export const createCard = async (cardData) => {
    try {
        const response = await api.post("/cards/CreateCard", cardData);
        return response.data;
    } catch (error) {
        console.error("Error creating card:", error);
        throw error;
    }
};

// VERIFY CARD (OTP)
export const verifyCard = async (verifyData) => {
    try {
        const response = await api.post("/cards/VerifyCard", verifyData);
        return response.data;
    } catch (error) {
        console.error("Error verifying card:", error);
        throw error;
    }
};

// GET ALL USER CARDS
export const getMyCards = async () => {
    try {
        const response = await api.get("/cards/GetMyCards");
        return response.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
};

// GET CARD BY ID
export const getCardById = async (cardId) => {
    try {
        const response = await api.get(`/cards/GetCardDetails/${cardId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching card details:", error);
        throw error;
    }
};

// DELETE CARD
export const deleteCard = async (cardId) => {
    try {
        const response = await api.delete(`/cards/DeleteCard/${cardId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting card:", error);
        throw error;
    }
};

// VERIFY CARD PIN
export const verifyCardPin = async (cardId, pin) => {
    try {
        const response = await api.post("/cards/VerifyPin", { card_id: cardId, pin });
        return response.data;
    } catch (error) {
        console.error("Error verifying card PIN:", error);
        throw error;
    }
};

const cardService = {
    createCard,
    verifyCard,
    verifyCardPin,
    getMyCards,
    getCardById,
    deleteCard
};

export default cardService;