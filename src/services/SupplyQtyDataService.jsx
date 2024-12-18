/* eslint-disable prettier/prettier */
import axios from "axios";

const useSupplyQtyDataService = () => {
    
    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`

    const getSupplyQtyData = async(api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response
        } catch (error) {
            throw error
        }
    }

    const updateSupplyQtyData = async(api, paramsMaterialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${paramsMaterialNo}`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    return {
        getSupplyQtyData,
        updateSupplyQtyData
    }
}

export default useSupplyQtyDataService