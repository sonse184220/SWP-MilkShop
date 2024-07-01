import axios from '../axios';

export const GetOrderDetail = (token, orderId) => {
    try {

        return axios.get(`/api/order/${orderId}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get order-detail for 1 user:', error);
        throw error;
    }
}