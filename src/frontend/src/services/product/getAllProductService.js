import axios from 'axios';

const handleGetAllProduct = () => {
    try {
        return axios.get("http://localhost:4500/api/product/");
    } catch (error) {
        console.error('An error occurred while fetching AllProducts results:', error);
        throw error;
    }
}

export default handleGetAllProduct;