import axios from 'axios';
import credentials from '../../credentials/baseUrl';

const api = axios.create({ baseURL: credentials.base_url });

export default api;
