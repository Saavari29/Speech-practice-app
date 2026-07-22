import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 120000  // 2 minutes
});

export default API;
