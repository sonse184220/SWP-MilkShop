import axios from '../axios';

export const searchBlogs = async (searchQuery) => {
    try {
        const response = await axios.get(`/api/blogs/search?content=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response || error.message);
        throw error;
    }
};
