import axios from '../axios';

export const CancelOrder = (token, orderId) => {
    try {

        return axios.patch(`/api/order/${orderId}/order-cancel`, {},
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get order-history for 1 user:', error);
        throw error;
    }
}