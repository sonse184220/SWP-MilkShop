import axios from "axios";

export const UpdateCart = (token, prInfo) => {
    try {
        return axios.post("http://localhost:4500/api/cart/update", prInfo,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while update cart:', error);
        throw error;
    }
}