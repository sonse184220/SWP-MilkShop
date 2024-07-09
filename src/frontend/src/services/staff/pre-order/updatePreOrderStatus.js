import axios from "../../axios";

export const UpdatePreOrderStatus = (token, preorderId, Status) => {
    try {
        return axios.patch(`/api/preorder/staff/${preorderId}/status`, Status,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while get update pre-orders status(staff):', error);
        throw error;
    }
}