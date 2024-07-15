import axios from "../../axios";

export const GetAllReport = (token, limit, page, sort, status) => {
    try {
        return axios.get(`/api/user-reports/staff/view?limit=${limit}&page=${page}&sort=${sort}&status=${status}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get all report:', error);
        throw error;
    }
}