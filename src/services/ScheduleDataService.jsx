/* eslint-disable prettier/prettier */
import axios from 'axios'

const useScheduleDataService = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const getScheduleByMonth = async(date) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/schedules/${date}`, 
                {
                    withCredentials: true
                }
            )
            return response
        } catch (error) {
            throw error
        }
    }

    const upsertSchedules = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/schedules`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    return{
        getScheduleByMonth,
        upsertSchedules
    }
}

export default useScheduleDataService