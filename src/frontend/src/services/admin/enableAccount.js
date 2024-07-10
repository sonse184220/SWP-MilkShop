import axios from "../axios";

export const EnableAccount = (token, userId) => {
    try {
        return axios.post(`/api/admin/enable-account`, userId,
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