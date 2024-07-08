import axios from '../axios';

const handleGetAllProduct = (page, limit) => {
    try {
        return axios.get(`/api/products?page=${page}&limit=${limit}`);
    } catch (error) {
        console.error('An error occurred while fetching AllProducts results:', error);
        throw error;
    }
}

export default handleGetAllProduct;