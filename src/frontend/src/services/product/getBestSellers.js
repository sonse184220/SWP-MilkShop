import axios from '../axios';

export const GetBestSellers = () => {
    try {
        return axios.get(`/api/products/bestsellers`);
    } catch (error) {
        console.error('An error occurred while fetching best sellers product results:', error);
        throw error;
    }
}