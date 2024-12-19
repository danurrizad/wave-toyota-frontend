/* eslint-disable prettier/prettier */
import axios from 'axios'


const useGentaniDataService = () => {

    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`

    const getGentaniData = async(api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response
        } catch (error) {
            console.log(error)
            throw error 
        }
    }

    const createGentaniData = async(api, body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/${api}`, body)
            return response
        } catch (error) {
            throw error 
        }
    }

    const createGentaniDataByUpload = async(api, bodyFile) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/${api}`, bodyFile)
            return response
        } catch (error) {
            throw error
        }
    }

    const updateGentaniData = async(api, paramsId, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${paramsId}`, body)
            return response
        } catch (error) {
            throw error 
        }
    }

    const deleteGentaniData = async(api, paramsId) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/${api}/${paramsId}`)
            return response
        } catch (error) {
            throw error 
        }
    }
    

  return {
    getGentaniData,
    createGentaniData,
    createGentaniDataByUpload,
    updateGentaniData,
    deleteGentaniData,
  }
}

export default useGentaniDataService