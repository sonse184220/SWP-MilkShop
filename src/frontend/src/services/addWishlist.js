import axios from 'axios';

export const AddWishList = () => {
    try {
        return axios.post(`http://localhost:4500/api/wishlist/iu?productId=P001`);
    } catch (error) {
        console.error('An error occurred while fetching AddWishList results:', error);
        throw error;
    }
}