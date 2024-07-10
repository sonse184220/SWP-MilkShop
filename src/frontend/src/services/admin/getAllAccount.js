import axios from "../axios";

export const GetAllAccount = (token, page, limit) => {
    try {
        return axios.get(`/api/admin/accounts?page=${page}&limit=${limit}`,
            {
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {

    }
}