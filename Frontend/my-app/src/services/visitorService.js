import api from "./api";

export const sendContactMessage = async (sender, subject, sender_email, message) => {
    try {
        const response = await api.post('/visitors/send_message', {
            sender,
            subject,
            sender_email,
            message
        });
        return response.data;
    } catch (error) {
        console.error("Error sending contact message:", error);
        throw error;
    }
};
