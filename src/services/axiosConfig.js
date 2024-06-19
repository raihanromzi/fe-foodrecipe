import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${accessToken}`;
  // You can also add more headers here
  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    // console.log("error getting data daftar resep makanan", error);
    return Promise.reject(error);
  }
);

export default instance;
