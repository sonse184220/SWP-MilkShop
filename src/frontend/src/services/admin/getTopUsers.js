import axios from "../axios";

export const GetTopUser = (token) => {
    try {
        return axios.get(`/api/admin/top-user`,
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