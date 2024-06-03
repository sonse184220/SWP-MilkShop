import axios from 'axios';

const handleLoginApi = (userInfo) => {
    try {
        return axios.post('http://localhost:4500/auth/login', userInfo)
    } catch (error) {
        // Handle the error here
        console.error('An error occurred while fetching search results:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}

export default handleLoginApi;