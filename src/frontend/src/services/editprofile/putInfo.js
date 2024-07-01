import axios from '../axios';

export const putInfo = async (userID, formData) => {
  try {
    const response = await axios.put(`/api/user/${userID}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response || error.message);
    throw error;
  }
};
