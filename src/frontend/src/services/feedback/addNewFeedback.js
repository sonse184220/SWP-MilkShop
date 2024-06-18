import axios from "axios";
const AddFeedback = (pid, feedback) => {
    try {
        return axios.post(`http://localhost:4500/api/product/${pid}/feedbacks`, feedback);
    } catch (error) {
        console.error('An error occurred while fetching add feedback results:', error);
        throw error;
    }
}

export default AddFeedback;