/* eslint-disable prettier/prettier */
import axios from 'axios'
import dotenv from 'dotenv';


const useMaterialDataService = () => {
    const url = import.meta.env.VITE_BACKEND_URL
    const BACKEND_URL = `${url}/api`

    const getMaterialData = async(api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response;
        } catch (error) {
            console.log(error)
            throw error; 
        }
    }

    const createMaterialData = async(api, body) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/${api}`, body)
            return response;
        } catch (error) {
            throw error; 
        }
    }

    const updateMaterialData = async(api, materialNo, body) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${materialNo}`, body)
            return response;
        } catch (error) {
            throw error; 
        }
    }

    const deleteMaterialData = async(api) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/${api}`)
            return response;
        } catch (error) {
            throw error; 
        }
    }

    const getMaterialNoGentaniData = async(api) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/${api}`)
            return response
        } catch (error) {
            throw error
        }
    }

    const setMaterialNoGentaniData = async(api, paramsMaterialNo) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${api}/${paramsMaterialNo}`)
            return response
        } catch (error) {
            throw error
        }
    }

  return {
    getMaterialData,
    createMaterialData,
    updateMaterialData,
    deleteMaterialData,
    getMaterialNoGentaniData,
    setMaterialNoGentaniData
  }
}

export default useMaterialDataService