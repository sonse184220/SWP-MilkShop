import axios from "../../axios";

export const StaffSearchProductByName = (token, searchInput) => {
    try {
        return axios.get(`/api/products/search?name=${searchInput}`,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while fetching search p by name (staff) results:', error);
        throw error;
    }
}