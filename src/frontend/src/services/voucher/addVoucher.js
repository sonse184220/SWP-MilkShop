// src/services/voucher/addVoucher.js
import axios from "../axios";
export const addVoucher = (token, vInfo) => {
    try {
        return axios.post(`/api/vouchers/create`, vInfo, {
            headers: {
                'Authorization': token,
            }
        });
    } catch (error) {
        console.error('An error occurred while adding voucher (staff):', error);
        throw error;
    }
};
