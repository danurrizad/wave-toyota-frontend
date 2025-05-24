/* eslint-disable prettier/prettier */
import axios from 'axios'
import { useToast } from '../App'
import { useAuth } from '../utils/context/authContext'

const useUsersDataService = () => {
    const addToast = useToast()
    const auth = useAuth()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleError = (error, message) => {
        if(error.response.data.message){
            addToast(error.response.data.message, 'danger', 'error')
        }else{
            addToast(error.message, 'danger', 'error')
        }
        throw new Error(message + error.message)
      }

    const register = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/users/register`, body, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            addToast(response.data.message, 'success', 'success')
            return response
        } catch (error) {
            handleError(error, 'Error registering new user: ')
        }
    }

    const getUserAll = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users`)
            return response
        } catch (error) {
            handleError(error, 'Error fetching users: ')
        }
    }

    const updateUserById = async(id, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/user/${id}`, body, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            addToast(response.data.message, 'success', 'success')
            return response
        } catch (error) {
            handleError(error, 'Error updating user: ')
        }
    }
    
    const deleteUserById = async(id) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            addToast(response.data.message, 'success', 'success')
        } catch (error) {
            handleError(error, 'Error deleting user: ')
        }
    }

    const changePasswordUserById = async(userId, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/change-password/${userId}`, body)
            addToast(response.data.message, 'success', 'success')
            return response
        } catch (error) {
            handleError(error, 'Error updating password: ')
        }
    }

    return{
        register,
        getUserAll,
        updateUserById,
        deleteUserById,
        changePasswordUserById
    }
}

export default useUsersDataService