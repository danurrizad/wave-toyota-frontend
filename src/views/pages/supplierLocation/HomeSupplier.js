/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import CIcon from '@coreui/icons-react'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'
import * as icon from "@coreui/icons"
import React, { useEffect, useState } from 'react'
import QrReader from '../../../utils/ReaderQR'
import QRtoLink from '../../../utils/QRtoLink'
import { useNavigate } from 'react-router-dom'
import useSupplyLocationService from '../../../services/SupplyLocation'

const HomeSupplier = () => {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showModalList, setShowModalList] = useState(false)
  const [listLocation, setListLocation] = useState([])
  const { getSupplyLocationAll } = useSupplyLocationService()
  const navigate = useNavigate()

  const fetchSupplyLocation = async() => {
    try {
      const response = await getSupplyLocationAll("", "")
      console.log("RESPONSE: ", response)
      setListLocation(response.data.data)
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSupplyLocation()
  }, [])
  
  const renderModal = () => {
    return(
      <CModal
        visible={showModal}
        onClose={()=>setShowModal(false)} 
      >
        <CModalHeader>
          <CModalTitle>QR Scanner</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <QRtoLink setShowModal={setShowModal}/>
        </CModalBody>
      </CModal>
    )
  }

  const handleCloseModalList = () => {
    setShowModalList(false)
  }

  const renderModalList = () => {
    return(
      <CModal
        visible={showModalList}
        onClose={handleCloseModalList}
      >
        <CModalHeader>
          <CModalTitle>List Location Supply</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5 className='mb-3'>Please select location</h5>
          { (listLocation.length > 0 && !loading) && listLocation?.map((item, index)=>{
            return(
              <CRow key={index} className='mb-3 px-2'>
                <CButton onClick={()=>navigate(`${item.location_name}/${item.plant}`)} color='secondary' className='py-3 text-start'>
                  {item.plant} | {item.location_name}
                </CButton>
              </CRow>
            )
          })}
          { (listLocation?.length === 0 || listLocation === null) && !loading && (
            <CRow>
              <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                  <CIcon icon={icon.cilFax} size='3xl'/>
                  <p className='pt-3'>No location found!</p>
              </div>
            </CRow>
          )}
            {loading && (
              <CRow>
                <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                    <CSpinner/>
                    <p className='pt-3'>Loading data</p>
                </div>
              </CRow>
            )}
        </CModalBody>
      </CModal>
    )
  }
  


  return (
    <div className='min-vh-100 pt-5 p-3 position-relative'>
      { renderModal() }
      { renderModalList() }

      {/* button back */}
      <div className='position-absolute start-3 top-0 mt-1'>
        <CButton onClick={()=>navigate('/')} className='d-flex align-items-center gap-3'>
          <CIcon icon={icon.cilArrowLeft}/>
          Back
        </CButton>
      </div>

      <h1 className='text-center'><span style={{ color: "red"}}>ANDON</span> SUPPLY</h1>
      <h4 className='text-center'>Supply Direct Material by QR Code</h4>

      <div className='d-flex flex-column justify-content-center align-items-center h-100 mt-5 '>
        <CButton onClick={()=>setShowModal(true)} color='danger' className='text-white d-flex flex-column justify-content-between align-items-center w-100 py-5'>
          <CIcon size='8xl' icon={icon.cilCamera}/>
          <h5>Click to open camera</h5>
        </CButton>
      </div>

      <div className='d-flex flex-column justify-content-center align-items-center h-100 mt-5 '>
        <CButton onClick={()=>setShowModalList(true)} color='info' className='text-white d-flex flex-column justify-content-between align-items-center w-100 py-5'>
          <CIcon size='8xl' icon={icon.cilInbox}/>
          <h5>Click to open List Location</h5>
        </CButton>
      </div>
    </div>
  )
}

export default HomeSupplier