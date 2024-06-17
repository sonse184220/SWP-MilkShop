import axios from "axios";
export const DeleteFeedback = (feedbackid) => {
    try {
        return axios.delete(`http://localhost:4500/api/product/feedbacks/${feedbackid}`);
    } catch (error) {
        console.error('An error occurred while fetching delete feedback results:', error);
        throw error;
    }
}