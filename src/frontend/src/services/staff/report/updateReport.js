import axios from "../../axios";

export const UpdateReport = (token, reportId, response) => {
    try {
        return axios.patch(`/api/user-reports/staff/${reportId}`, { response },
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while update report:', error);
        throw error;
    }
}