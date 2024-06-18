import axios from 'axios';

export const fetchBlogs = async () => {
    try {
        const response = await axios.get(`http://localhost:4500/api/blogs`);
        return response;
    } catch (error) {
        console.error('Error fetching blogs:', error.response || error.message);
        throw error;
    }
};
