import axios from '../axios';

export const Get1UserOrder = (token, userId, limit, page, sort) => {
    try {

        return axios.get(`/api/user/${userId}/order-history?limit=${limit}&page=${page}&sort=${sort}`,
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