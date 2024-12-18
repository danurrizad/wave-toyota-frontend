/* eslint-disable prettier/prettier */
import axios from 'axios'

const useUsersDataService = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const register = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/users/register`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    const getUserAll = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users`)
            return response
        } catch (error) {
            throw error
        }
    }
    

    return{
        register,
        getUserAll
    
    }
}

export default useUsersDataService