import axios from 'axios';

export const AddWishlist = (pID) => {
    try {
        return axios.post(`http://localhost:4500/api/wishlist/iu?productId=${pID}`);
    } catch (error) {
        console.error('An error occurred while fetching AddWishList results:', error);
        throw error;
    }
}