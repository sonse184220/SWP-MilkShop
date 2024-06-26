import axios from '../axios';

export const RemoveWishlist = (uID, pID) => {
    try {
        return axios.delete(`/api/wishlist/${uID}?productId=${pID}`);
    } catch (error) {
        console.error('An error occurred while fetching removeWishList results:', error);
        throw error;
    }
}