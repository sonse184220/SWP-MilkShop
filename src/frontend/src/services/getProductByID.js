import axios from 'axios';

const getProductById = (pID) => {
    try {
        return axios.get(`http://localhost:4500/api/product/${pID}`);
    } catch (error) {
        console.error('An error occurred while fetching ProductsByID results:', error);
        throw error;
    }
}

export default getProductById;