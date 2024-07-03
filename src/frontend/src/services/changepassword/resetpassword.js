import axios from '../axios';

export const ResetPassword = (data) => {
    try {
        return axios.post(`/api/reset-password/request-reset-password`, data
        );
    } catch (error) {
        console.error('An error occurred while reset password', error);
        throw error;
    }
}