import axios from "../axios";

export const deleteVoucher = async (token, voucherID) => {
    try {
        return await axios.delete(`/api/vouchers/staff/${voucherID}/delete`, {
            headers: {
                'Authorization': token,
            }
        });
    } catch (error) {
        console.error('An error occurred while deleting the voucher:', error);
        throw error;
    }
}
