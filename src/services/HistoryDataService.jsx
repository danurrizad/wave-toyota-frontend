/* eslint-disable prettier/prettier */
import axios from "axios";

const useHistoryDataService = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    // const BACKEND_URL = `${url}/api`

    const getConsumptionHistory = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/consumption`)
            return response
        } catch (error) {
            throw error
        }
    }

    const createConsumptionHistory = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/consumption`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    const getSupplyHistory = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/history/supply`)
            return response
        } catch (error) {
            throw error
        }
    }

    const supplyingAndCreateHistory = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/history/supply`, body)
            return response
        } catch (error) {
            throw error
        }
    }
    

    return{
        getConsumptionHistory,
        createConsumptionHistory,
        getSupplyHistory,
        supplyingAndCreateHistory
    }
}

export default useHistoryDataService