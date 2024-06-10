import axios from "axios";

const GetProductByBrandID = (brandid) => {
    try {
        return axios.get(`http://localhost:4500/api/products/search/brand?id=${brandid}`);
    } catch (error) {
        console.error('An error occurred while fetching Product by BrandID results:', error);
        throw error;
    }
}
export default GetProductByBrandID;