import axios from 'axios';

export const getUser = async (userID) => {
  try {
    const response = await axios.get(`http://localhost:4500/api/user/${userID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response || error.message);
    throw error;
  }
};
