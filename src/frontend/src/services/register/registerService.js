import axios from '../axios';

const handleRegisterApi = (userInfo) => {
    try {
        return axios.post('/api/auth/register', userInfo);
    } catch (error) {
        console.error('An error occurred while fetching register results:', error);
        throw error;
    }
}

export default handleRegisterApi;