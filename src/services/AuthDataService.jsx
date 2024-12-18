/* eslint-disable prettier/prettier */
import axios from 'axios'

const useAuthDataService = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const login = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, body)
            return response
        } catch (error) {
            throw error
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
            throw error
        }
    }

    return{
        login,
        verifyToken
    }
}

export default useAuthDataService