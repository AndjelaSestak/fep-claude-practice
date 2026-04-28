import api from "./api";

export const sendMessageFromContactUsPage = async (sender, subject, sender_email, message) => {
    try {
        const response = await api.post('/visitors/send-message', {
            sender,
            subject,
            sender_email,
            message
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message from contact us page:", error);
        throw error;
    }
};