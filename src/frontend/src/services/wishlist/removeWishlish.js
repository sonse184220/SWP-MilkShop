import axios from '../axios';

export const RemoveWishlist = (token, uID, pID) => {
    try {
        return axios.delete(`/api/wishlist/?productId=${pID}`,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while fetching removeWishList results:', error);
        throw error;
    }
}