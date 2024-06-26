import axios from '../axios';

const getProductById = (pID) => {
    try {
        return axios.get(`/api/product/${pID}`);
    } catch (error) {
        console.error('An error occurred while fetching ProductsByID results:', error);
        throw error;
    }
}

export default getProductById;