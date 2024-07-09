import axios from '../axios';

export const CompleteProfile = (token, userInfo) => {
    try {
        return axios.post('/api/google/complete-registration', userInfo,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while complete profile by google:', error);
        throw error;
    }
}