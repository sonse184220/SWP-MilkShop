import axios from '../axios';

export const Logout = (token) => {
    try {
        return axios.post('/api/logout/', {},
            {
                headers: {
                    'Authorization': token,
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while logout:', error);
        throw error;
    }
}