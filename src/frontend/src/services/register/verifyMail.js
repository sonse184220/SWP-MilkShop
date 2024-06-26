import axios from 'axios';

export const VerifyEmail = (token) => {
    try {
        return axios.get(`http://localhost:4500/api/auth/verify-email?token=${token}`);
    } catch (error) {
        console.error('An error occurred while fetching register results:', error);
        throw error;
    }
}
