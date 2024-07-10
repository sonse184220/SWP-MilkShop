import axios from "../axios";

export const DisableAccount = (token, userId) => {
    try {
        return axios.post(`/api/admin/disable-account`, userId,
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