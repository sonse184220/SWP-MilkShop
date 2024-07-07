import axios from '../axios';

export const searchBlogs = async (searchQuery, limit, page, sort) => {
    try {
        const response = await axios.get(`/api/blogs/search?content=${searchQuery}&limit=${limit}&page=${page}&sort=${sort}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response || error.message);
        throw error;
    }
};
