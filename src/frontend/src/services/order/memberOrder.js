import axios from "../axios";

export const MemberOrder = (token, OrderInfo) => {
    try {
        return axios.post("/api/order/place-order", OrderInfo,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while order member:', error);
        throw error;
    }
}