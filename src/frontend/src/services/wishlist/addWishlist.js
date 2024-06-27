import axios from '../axios';

export const AddWishlist = (token, uID, pID) => {
    try {
        return axios.post(`/api/wishlist/${uID}?productId=${pID}`, {},
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