import axios from "../axios";

export const GetMonthlyRevenue = (token) => {
    try {
        return axios.get(`/api/admin/monthly-revenue`,
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