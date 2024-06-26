import axios from "../axios";

export const ViewCart = (token) => {
    try {
        return axios.get("/api/cart/view",
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while view cart:', error);
        throw error;
    }
}