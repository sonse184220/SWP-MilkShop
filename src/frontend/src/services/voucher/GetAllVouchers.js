import axios from "../axios";

export const GetAllVouchers = (token) => {
    try {
        return axios.get(`/api/vouchers/available`,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while get all vouchers:', error);
        throw error;
    }
}