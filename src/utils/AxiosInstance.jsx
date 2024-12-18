/* eslint-disable prettier/prettier */
import axios from 'axios'
import config from './Config.js'

const axiosInstance = axios.create({
  baseURL: `${config.BACKEND_URL}/api`,
  withCredentials: true,
})

export default axiosInstance
