/* eslint-disable prettier/prettier */
import axios from 'axios'
import { useToast } from '../App'

const useSupplyLocationService = () =>{
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

    const getSupplyLocationAll = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/supply-location`)
            return response
        } catch (error) {
            handleError(error)
        }
    }
    
    const getSupplyLocationByName = async(locationName, plant) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/supply-location/${locationName}/${plant}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const createSupplyLocation = async(body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/supply-location`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }
    const updateSupplyLocation = async(body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/supply-location/update`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }
    const deleteSupplyLocationByName = async(id) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/supply-location/delete/${id}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }


    return {
        getSupplyLocationAll,
        getSupplyLocationByName,
        createSupplyLocation,
        updateSupplyLocation,
        deleteSupplyLocationByName
      }
}

export default useSupplyLocationService