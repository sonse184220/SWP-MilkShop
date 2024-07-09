import axios from "../../axios";

export const UpdatePreOrderETA = (token, prId, etaDate) => {
    try {
        return axios.patch(`/api/preorder/staff/${prId}/eta`, etaDate,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while update eta preorders (staff):', error);
        throw error;
    }
}