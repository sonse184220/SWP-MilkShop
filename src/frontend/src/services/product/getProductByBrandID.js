import axios from "../axios";

const GetProductByBrandID = (brandid, page, limit, sort) => {
    try {
        return axios.get(`/api/products/search/brand?id=${brandid}&limit=${limit}&page=${page}&sort=${sort}`);
    } catch (error) {
        console.error('An error occurred while fetching Product by BrandID results:', error);
        throw error;
    }
}
export default GetProductByBrandID;