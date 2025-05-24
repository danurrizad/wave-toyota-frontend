/* eslint-disable prettier/prettier */
import axios from "axios"
import { useAuth } from "../utils/context/authContext"
import { useToast } from "../App"

const useMasterDataService = () => {
  const addToast = useToast()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const auth = useAuth()

  const handleError = (error, message) => {
    console.error(message, error)

    // Cek apakah ada data duplikat di error.response.data
    if (error.response?.data?.duplicates) {
      const duplicates = error.response.data.duplicates
        .map((dup) => `Row: ${dup.rowNumber}, Data: ${dup.data.join(', ')}`)
        .join('<br>')

      addToast(error.response?.data?.message + duplicates, 'danger', 'error')
    } else {
      // Tampilkan pesan error biasa
      addToast(error.response?.data?.message, 'danger', 'error')
    }
    throw new Error(message + (error.message || ''))
  }

  const getMasterData = async (api) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/${api}`, {
        headers: {
            Authorization: `Bearer ${auth.token}`,
          },
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching:')
    }
  }

  const getMasterDataById = async (api, id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/${api}/${id}`)
      return response.data 
    } catch (error) {
      handleError(error, `Error fetching data for ID ${id}:`)
    }
  }

  const postMasterData = async (api, data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/${api}`, data)
      addToast(response?.data?.message, 'success', 'success')
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const uploadMasterData = async (api, data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/${api}`, data)
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const updateMasterDataById = async (api, id, data) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/${api}/${id}`, data)
      addToast(response?.data?.message, 'success', 'success')
      return response.data 
    } catch (error) {
      handleError(error, `Error update data for ID ${id}:`)
    }
  }

  const deleteMasterDataById = async (api, id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/${api}/${id}`)
      addToast(response?.data?.message, 'success', 'success')
      return response.data
    } catch (error) {
      handleError(error, `Error delete data for ID ${id}:`)
    }
  }


  return {
    getMasterData,
    getMasterDataById,
    postMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    uploadMasterData,
  }
}

export default useMasterDataService
