import axios from "../axios";
const AddFeedback = (token, pid, feedback) => {
    try {
        return axios.post(`/api/product/${pid}/feedbacks`, feedback,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('An error occurred while fetching add feedback results:', error);
        throw error;
    }
}

export default AddFeedback;