import axios from "../../axios";

export const UpdateBlog = (token, bId, bInfo) => {
    try {
        return axios.patch(`/api/blog/${bId}`, bInfo,
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