import axios from "../../axios";

export const UpdateOrderPaymentStatus = (token, orderId) => {
    try {
        return axios.patch(`/api/order/staff/${orderId}/payment-done`, {},
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while get update orders payment status(staff):', error);
        throw error;
    }
}