/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import CIcon from '@coreui/icons-react'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import * as icon from "@coreui/icons"
import React, { useState } from 'react'
import QrReader from '../../../utils/ReaderQR'
import QRtoLink from '../../../utils/QRtoLink'
import { useNavigate } from 'react-router-dom'

const HomeSupplier = () => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  
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
  


  return (
    <div className='min-vh-100 pt-5 p-3 position-relative'>
      { renderModal() }

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
    </div>
  )
}

export default HomeSupplier