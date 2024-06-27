import axios from "../axios";

export const AddToCart = (token, prInfo) => {
    try {
        return axios.post("/api/cart/add", prInfo,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add to cart:', error);
        throw error;
    }
}