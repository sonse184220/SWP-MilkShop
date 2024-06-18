import axios from 'axios';

export const GetWishlist = (uID) => {
    try {
        return axios.get(`http://localhost:4500/api/wishlist/${uID}`);
    } catch (error) {
        console.error('An error occurred while fetching GetWishList results:', error);
        throw error;
    }
}