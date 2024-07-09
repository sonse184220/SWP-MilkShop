import axios from "../axios";

export const UpdateVoucher = (token, voucherID, updatedVoucherInfo) => {
    try {
        return axios.patch(`/api/vouchers/staff/${voucherID}/update`, updatedVoucherInfo,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add voucher (staff):', error);
        throw error;
    }
}