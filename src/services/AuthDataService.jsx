/* eslint-disable prettier/prettier */
import axios from 'axios'
import { useToast } from '../App'

const useAuthDataService = () => {
    const addToast = useToast()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleError = (error, message) => {
        if(error.response.data.message){
            addToast(error.response.data.message, 'danger', 'error')
        }else{
            addToast(error.message, 'danger', 'error')
        }
        throw new Error(message + error.message)
      }


    const login = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, body, 
                {
                    withCredentials: true
                }
            )
            console.log("RESPONSE LOGIN: ", response)
            return response
        } catch (error) {
            handleError(error, 'Login error: ')
        }
    }

    const verifyToken = async(token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/verify-token`, 
            {},
            {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
            })
            return response
        } catch (error) {
            handleError(error, 'Error verrifying token: ')
        }
    }

    const refreshToken = async(token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/refresh-token`, 
            {},
            {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
            })
            return response
        } catch (error) {
            handleError(error, 'Error refreshing token: ')
        }
    }

    return{
        login,
        verifyToken,
        refreshToken
    }
}

export default useAuthDataService