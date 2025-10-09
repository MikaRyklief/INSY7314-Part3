import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

let csrfToken = '';

export const setCsrfToken = (token) => {
  csrfToken = token;
};

apiClient.interceptors.request.use((config) => {
  if (config.method && config.method.toLowerCase() !== 'get' && csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

export const fetchCsrfToken = async () => {
  const response = await apiClient.get('/security/csrf-token');
  const token = response.data?.csrfToken;
  if (token) {
    setCsrfToken(token);
  }
  return token;
};

export default apiClient;
