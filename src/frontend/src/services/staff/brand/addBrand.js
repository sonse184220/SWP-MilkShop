
import axios from "../../axios";

export const AddBrand = (token, brandData) => {
    console.log("Token received in AddBrand:", token);
    console.log("brandData received in AddBrand:", brandData);
    try {
        return axios.post(`/api/brand/staff/create`, brandData,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add Brand (staff):', error);
        throw error;
    }
}