import axios from '../axios';

export const blogDetail = async (id) => {
    try {
        const response = await axios.get(`/api/blog/${id}`);
        return response.data; // Assuming the API returns an array, we get the first object
    } catch (error) {
        console.error('Error fetching blog:', error.response || error.message);
        throw error;
    }
};
