import axios from "../axios";

export const GetAllVouchersMember = async (token) => {
    try {
        return axios.get(`/api/vouchers/available`,
            {
                headers: {
                    'Authorization': token,
                }
            });

    } catch (error) {
        console.error('An error occurred while fetching vouchers member:', error);
        throw error;
    }
};
