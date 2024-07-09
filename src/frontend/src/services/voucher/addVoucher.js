import axios from "../axios";

export const addVoucher = (token, voucherData) => {
  try {
    return axios.post(`/api/vouchers/create`, voucherData, {
        headers: {
            'Authorization': token,
        }
    });
  } catch (error) {
    console.error('An error occurred while adding voucher:', error);
    throw error;
  }
};
