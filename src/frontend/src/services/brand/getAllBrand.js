import axios from "../axios";

export const handleAllBrand = () => {
    try {
        return axios.get("/api/brand/");
    } catch (error) {
        console.error('An error occurred while fetching AllBrand results:', error);
        throw error;
    }
}