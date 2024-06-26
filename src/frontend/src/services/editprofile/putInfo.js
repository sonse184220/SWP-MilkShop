import axios from '../axios';

export const putInfo = async (userID, updatedUserData) => {
  try {
    const response = await axios.put(`/api/user/${userID}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response || error.message);
    throw error;
  }
};
