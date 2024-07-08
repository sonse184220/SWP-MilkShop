import axios from "../../axios";

export const AddProduct = (token, pInfo) => {
    try {
        return axios.post(`/api/product/create`, pInfo,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add Product (staff):', error);
        throw error;
    }
}