/* eslint-disable prettier/prettier */
import axios from 'axios'

const useSetupDataService = () =>{

    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`

    const getSetupData = async(api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response
        } catch (error) {
            console.log(error)
            throw error 
        }
    }

    const updateSetupData = async(api, paramsMaterialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${paramsMaterialNo}`, body)
            return response
        } catch (error) {
            throw error
        }
    }

    return {
        getSetupData,
        updateSetupData
      }
}

export default useSetupDataService