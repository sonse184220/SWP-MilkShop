import axios from '../axios';

export const SendReport = (token, report) => {
    try {
        return axios.post('/api/user-reports/submit', report,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add report:', error);
        throw error;
    }
}