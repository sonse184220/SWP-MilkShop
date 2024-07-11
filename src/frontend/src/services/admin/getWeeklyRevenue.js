import axios from "../axios";

export const GetWeeklyRevenue = (token) => {
    try {
        return axios.get(`/api/admin/weekly-revenue`,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {

    }
}