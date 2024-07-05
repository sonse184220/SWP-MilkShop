import axios from "../../axios";

export const GetAllOrders = (token, limit, page, sort) => {
    try {
        return axios.get(`/api/order/history?limit=${limit}&page=${page}&sort=${sort}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get all orders (staff):', error);
        throw error;
    }
}