import axios from "../axios";

export const addVoucher = (token, voucherData) => {
  try {
    console.log("Add voucher data: ", voucherData);
    return axios.post(`/api/vouchers/staff/create`, voucherData, {
        headers: {
            'Authorization': token,
        }
    });
  } catch (error) {
    console.error('An error occurred while adding voucher:', error);
    throw error;
  }
};
