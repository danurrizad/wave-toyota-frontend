/* eslint-disable prettier/prettier */
import axios from "axios";
import { useToast } from "../App";

const useSupplyQtyDataService = () => {
    
    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`
    const addToast = useToast()
        
    const handleError = (error) => {
        if (error.response?.data) {
            addToast(error.response?.data?.message, 'danger', 'error')
        } else {
            addToast(error.message, 'danger', 'error')
        }
        throw new Error(error.message || '')
    }

    const getSupplyQtyData = async(api, plant) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}?plant=${plant}`)
            return response
        } catch (error) {
            throw error
        }
    }

    const getSupplyQtyDataByNoPlant = async(material_no, plant) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/supply-qty/${material_no}/${plant}`)
            return response
        } catch (error) {
            handleError(error)
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
        getSupplyQtyDataByNoPlant,
        updateSupplyQtyData
    }
}

export default useSupplyQtyDataService