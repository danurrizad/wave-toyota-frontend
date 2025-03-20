/* eslint-disable prettier/prettier */
import axios from 'axios'

const useDaysDataService = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const getDays = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/days`, 
                {
                    withCredentials: true
                }
            )
            return response
        } catch (error) {
            throw error
        }
    }

    const updateDays = async(body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/days/1`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    return{
        getDays,
        updateDays
    }
}

export default useDaysDataService