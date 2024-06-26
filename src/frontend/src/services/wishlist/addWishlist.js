import axios from '../axios';

export const AddWishlist = (uID, pID) => {
    try {
        return axios.post(`/api/wishlist/${uID}?productId=${pID}`);
    } catch (error) {
        console.error('An error occurred while fetching AddWishList results:', error);
        throw error;
    }
}