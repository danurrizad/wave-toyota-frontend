/* eslint-disable prettier/prettier */
import axios from "axios";
import { useToast } from '../App'

const useHistoryDataService = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
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

    const getConsumptionHistory = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/consumption`)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const getConsumptionHistoryOnRange = async(startDate, endDate) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/consumption-history?startDate=${startDate}&endDate=${endDate}`)
            return response   
        } catch (error) {
            handleError(error)
        } 
    }

    const getTotalUnitConsumption = async(startDate, endDate) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/total-units?startDate=${startDate}&endDate=${endDate}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }
    const createConsumptionHistory = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/consumption`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const getSupplyHistory = async(startDate, endDate, plant, materialNo) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/history/supply?startDate=${startDate}&endDate=${endDate}&plant=${plant}&materialNo=${materialNo}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const supplyingAndCreateHistory = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/history/supply`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }
    

    return{
        getConsumptionHistory,
        getConsumptionHistoryOnRange,
        createConsumptionHistory,
        getTotalUnitConsumption,
        getSupplyHistory,
        supplyingAndCreateHistory
    }
}

export default useHistoryDataService