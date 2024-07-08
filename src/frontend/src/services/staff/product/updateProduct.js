import axios from "../../axios";

export const UpdateProduct = (token, pID, pInfo) => {
    try {
        return axios.put(`/api/product/${pID}`, pInfo,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while update Product (staff):', error);
        throw error;
    }
}