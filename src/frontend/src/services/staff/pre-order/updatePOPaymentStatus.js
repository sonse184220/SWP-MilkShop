import axios from "../../axios";

export const UpdatePreOrderPaymentStatus = (token, preorderId) => {
    try {
        return axios.patch(`/api/preorder/staff/${preorderId}/payment-done`, {},
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while get update preorders payment status(staff):', error);
        throw error;
    }
}