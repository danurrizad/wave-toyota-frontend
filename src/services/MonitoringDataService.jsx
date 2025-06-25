/* eslint-disable prettier/prettier */
import axios from 'axios'
import { useToast } from '../App'

const useMonitoringDataService = () => {
    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`
    const addToast = useToast()
    
    const handleError = (error) => {
        if (error.response){
            addToast(error.response.data.message, 'danger', 'error')
        }
        else{
            addToast(error.message, 'danger', 'error')
        }
        throw error
    }

    const getMonitoringData = async(api, visualizationName) =>{
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}?visualizationName=${visualizationName}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const updateMonitoringData = async(api, materialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${materialNo}`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    return{
        getMonitoringData,
        updateMonitoringData
    }
}

export default useMonitoringDataService