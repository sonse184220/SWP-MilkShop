import axios from "../axios";
export const DeleteFeedback = (feedbackid, token) => {
    try {
        return axios.delete(`/api/product/feedbacks/${feedbackid}`,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while fetching delete feedback results:', error);
        throw error;
    }
}