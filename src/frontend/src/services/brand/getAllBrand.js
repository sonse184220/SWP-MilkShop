import axios from "axios";

export const handleAllBrand = () => {
    try {
        return axios.get("http://localhost:4500/api/brand/");
    } catch (error) {
        console.error('An error occurred while fetching AllBrand results:', error);
        throw error;
    }
}