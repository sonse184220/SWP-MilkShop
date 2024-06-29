import axios from "../axios";

export const GuestOrder = (OrderInfo) => {
    try {
        return axios.post("/api/order/place-order", OrderInfo);
    } catch (error) {
        console.error('An error occurred while order guest:', error);
        throw error;
    }
}