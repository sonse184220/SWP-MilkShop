import axios from "../axios";

export const AddStaff = (token, staffinfo) => {
    try {
        return axios.post(`/api/auth/create-staff`, staffinfo,
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