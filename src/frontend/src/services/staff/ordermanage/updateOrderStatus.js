import axios from "../../axios";

export const UpdateOrderStatus = (token, orderId, Status) => {
    try {
        return axios.patch(`/api/order/staff/${orderId}/status`, Status,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while get update orders status(staff):', error);
        throw error;
    }
}