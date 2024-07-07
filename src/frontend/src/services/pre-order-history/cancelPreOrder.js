import axios from '../axios';

export const CancelPreOrder = (token, preorderid) => {
    try {

        return axios.patch(`/api/user/${preorderid}/preorder-cancel`, {},
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while cancel pre-order for 1 user:', error);
        throw error;
    }
}