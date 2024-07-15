import axios from "../../axios";

export const GetReportDetail = (token, reportId) => {
    try {
        return axios.get(`/api/user-reports/${reportId}`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get report detail:', error);
        throw error;
    }
}