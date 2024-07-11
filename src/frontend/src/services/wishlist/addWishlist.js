import axios from '../axios';

export const AddWishlist = (token, pID) => {
    try {
        return axios.post(`/api/wishlist/add?productId=${pID}`, {},
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while fetching AddWishList results:', error);
        throw error;
    }
}