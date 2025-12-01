import axios from 'axios';

const axiosConfig = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:9000"
})


export default axiosConfig