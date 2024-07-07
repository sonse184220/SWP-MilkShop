import axios from '../axios';

export const fetchBlogs = async (limit, page, sort) => {
    try {
        const response = await axios.get(`/api/blogs?limit=${limit}&page=${page}&sort=${sort}`);
        return response;
    } catch (error) {
        console.error('Error fetching blogs:', error.response || error.message);
        throw error;
    }
};
