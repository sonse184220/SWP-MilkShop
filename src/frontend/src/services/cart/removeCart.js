import axios from "axios";

export const RemoveCart = (token, prID) => {
    try {
        return axios.post("http://localhost:4500/api/cart/remove", prID,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while remove cart:', error);
        throw error;
    }
}