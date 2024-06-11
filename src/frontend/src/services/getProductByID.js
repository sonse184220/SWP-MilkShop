import axios from 'axios';

const getProductById = (pID) => {
    try {
        return axios.get(`http://localhost:4500/api/product/${pID}`);
    } catch (error) {

    }
}

export default getProductById;