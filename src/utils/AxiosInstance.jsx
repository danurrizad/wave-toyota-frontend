/* eslint-disable prettier/prettier */
import axios from 'axios'
// import config from './Config.js'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
})


// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("site"); // Replace with state if needed
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Handle token expiration
//       try {
//         const { data } = await axios.post(
//           "/auth/refresh",
//           {},
//           { withCredentials: true } // Ensure cookies are sent
//         );

//         // Update access token and retry original request
//         localStorage.setItem("site", data.accessToken);
//         error.config.headers.Authorization = `Bearer ${data.accessToken}`;
//         return axiosInstance(error.config);
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         // Redirect to login or handle logout
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance
