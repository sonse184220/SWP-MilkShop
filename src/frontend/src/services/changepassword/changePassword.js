import axios from '../axios';

export const changePassword = (token, data) => {
  try {
      return axios.post(`/api/user/change-password`, data,
          {
              headers: {
                  'Authorization': token,
                  'Content-Type': 'application/json'
              }
          }
      );
  } catch (error) {
      console.error('An error occurred while update cart:', error);
      throw error;
  }
}
