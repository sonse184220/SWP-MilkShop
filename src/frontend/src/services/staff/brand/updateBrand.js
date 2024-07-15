
import axios from "../../axios";

export const UpdateBrand = (token, brandId, brandData) => {
    try {
        return axios.patch(`/api/brand/staff/${brandId}`, brandData,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('An error occurred while get update brand(staff):', error);
        throw error;
    }
}