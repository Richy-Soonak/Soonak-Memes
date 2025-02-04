import axios from 'axios';
import useNotification from './useNotification';

export const useServerAPI = () => {
  const { showNotification } = useNotification()
  const serverAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  serverAPI.interceptors.response.use(
    (res) => res,
    (err) => {
      console.log("::axios error:", err)
      if (String(err).includes('Network Error')) {
        showNotification('Network Conenction Error. Please check your internet connection', 'error')
      } else if (err.response) {
        showNotification(String(err?.response?.data?.error), 'error')
      } else {
        showNotification('Failed to run request. Please try again later', 'error')
      }
      return Promise.reject(err);
    }
  );
  return { serverAPI }
};
