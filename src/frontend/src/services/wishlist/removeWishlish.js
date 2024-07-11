import axios from '../axios';

export const RemoveWishlist = (token, pID) => {
    try {
        return axios.delete(`/api/wishlist/remove?productId=${pID}`,
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