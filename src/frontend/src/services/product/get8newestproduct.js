import axios from '../axios';

export const Get8NewestProduct = () => {
    try {
        return axios.get(`/api/products/latest`);
    } catch (error) {
        console.error('An error occurred while fetching newest product results:', error);
        throw error;
    }
}