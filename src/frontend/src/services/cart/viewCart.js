import axios from "axios";

export const ViewCart = (token) => {
    try {
        return axios.get("http://localhost:4500/api/cart/view",
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