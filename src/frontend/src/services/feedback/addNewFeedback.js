import axios from "../axios";
const AddFeedback = (pid, feedback) => {
    try {
        return axios.post(`/api/product/${pid}/feedbacks`, feedback);
    } catch (error) {
        console.error('An error occurred while fetching add feedback results:', error);
        throw error;
    }
}

export default AddFeedback;