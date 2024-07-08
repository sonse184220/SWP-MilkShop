import axios from "../../axios";

export const deleteBlog = async (token, blogId) => {
    try {
        return await axios.delete(`/api/blog/${blogId}`, {
            headers: {
                'Authorization': token,
            }
        });
    } catch (error) {
        console.error('An error occurred while deleting the blog:', error);
        throw error;
    }
}
