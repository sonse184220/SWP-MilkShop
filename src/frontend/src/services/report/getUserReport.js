import axios from '../axios';

export const GetUserReport = (token, userId, limit, page, sort, status) => {
    try {
        return axios.get(`/api/user-reports/${userId}/history?limit=${limit}&page=${page}&sort=${sort}&status=${status}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get user report:', error);
        throw error;
    }
}