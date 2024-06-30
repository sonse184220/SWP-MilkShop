import axios from "../axios";

export const PreOrder = (token, OrderInfo) => {
    try {
        return axios.post("/api/preorder/place-preorder", OrderInfo,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while pre-order:', error);
        throw error;
    }
}