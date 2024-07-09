import axios from "../axios";

export const GetAllVouchers = async (limit, page, sort,token) => {
  try {
    const response = await axios.get(`/api/vouchers/staff/view?limit=${limit}&page=${page}&sort=${sort}`,{
        headers: {
            'Authorization': token,
        }
    });
    console.log("GetAllVouchers response:", response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching vouchers:', error);
    throw error;
  }
};
