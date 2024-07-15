import axios from "../../axios";


export const DeleteBrand = async (token, brandId) => {
    try {
        return await axios.delete(`/api/brand/staff/${brandId}/delete`, {
            headers: {
                'Authorization': token,
            }
        });
    } catch (error) {
        console.error('An error occurred while deleting the brand:', error);
        throw error;
    }
}

