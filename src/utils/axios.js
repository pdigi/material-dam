import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'baseurl' });


axiosInstance.interceptors.response.use(
  (response) => {
console.log(response, "inter")
return response;
  },
  (error) => {
    // Handle the error here or perform any desired actions
    if (error.response) {
      console.log('API Error:', error.response.status);
    } else if (error.request) {
      console.log('API Error: Request failed');
    } else {
      console.log('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;