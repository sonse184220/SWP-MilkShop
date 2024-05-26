import axios from 'axios';
const handleSearchApi = (name) => {
    try {
        return axios.get(`http://localhost:8080/api/products/search?n=${name}`)
    } catch (error) {
        // Handle the error here
        console.error('An error occurred while fetching search results:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}

export default handleSearchApi;