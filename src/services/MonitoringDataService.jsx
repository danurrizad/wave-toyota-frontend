/* eslint-disable prettier/prettier */
import axios from 'axios'

const useMonitoringDataService = () => {
    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`

    const getMonitoringData = async(api) =>{
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response
        } catch (error) {
            throw error
        }
    }

    const updateMonitoringData = async(api, materialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${materialNo}`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    return{
        getMonitoringData,
        updateMonitoringData
    }
}

export default useMonitoringDataService