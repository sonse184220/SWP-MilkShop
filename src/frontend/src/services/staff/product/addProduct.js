import axios from "../../axios";

export const AddProduct = (token, pInfo) => {
    try {
        return axios.put(`/api/product/create`, pInfo,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add Product (staff):', error);
        throw error;
    }
}