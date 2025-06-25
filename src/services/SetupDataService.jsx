/* eslint-disable prettier/prettier */
import axios from 'axios'
import { useToast } from '../App'

const useSetupDataService = () =>{

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

    const getSetupData = async(api, plant) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}?plant=${plant}`)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const updateSetupData = async(api, paramsMaterialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${paramsMaterialNo}`, body)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    return {
        getSetupData,
        updateSetupData
      }
}

export default useSetupDataService