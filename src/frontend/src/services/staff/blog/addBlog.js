import axios from "../../axios";

export const AddBlog = (token, bInfo) => {
    try {
        return axios.post(`/api/blog/create`, bInfo,
            {
                headers: {
                    'Authorization': token,
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while add blog (staff):', error);
        throw error;
    }
}