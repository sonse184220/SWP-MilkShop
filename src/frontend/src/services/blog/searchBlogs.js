import axios from '../axios';

export const searchBlogs = async (searchQuery, searchLimit, searchPage, searchSort) => {
    try {
        const response = await axios.get(`/api/blogs/search?content=${searchQuery}&limit=${searchLimit}&page=${searchPage}&sort=${searchSort}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response || error.message);
        throw error;
    }
};
