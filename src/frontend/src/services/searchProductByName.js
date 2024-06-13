import axios from "axios";

export const SearchProductByName = (searchInput) => {
    try {
        return axios.get(`http://localhost:4500/api/products/search?name=${searchInput}`);
    } catch (error) {
        console.error('An error occurred while fetching search p by name results:', error);
        throw error;
    }
}