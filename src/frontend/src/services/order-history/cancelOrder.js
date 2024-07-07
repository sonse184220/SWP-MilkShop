import axios from '../axios';

export const CancelOrder = (token, orderId) => {
    try {

        return axios.patch(`/api/user/${orderId}/order-cancel`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get order-history for 1 user:', error);
        throw error;
    }
}