import axios from '../axios';

export const GetAvailableProduct = (page, limit) => {
    try {
        return axios.get(`/api/available-products?page=${page}&limit=${limit}`);
    } catch (error) {
        console.error('An error occurred while fetching AllProducts available results:', error);
        throw error;
    }
}