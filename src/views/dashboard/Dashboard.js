/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react'
import { CContainer, CCol, CRow, CImage, CButton, CToaster } from '@coreui/react'
import ImageDashboard from '/src/assets/images/dashboard/dashboard_img_2.png'

const Dashboard = () => {
  return (
    <CContainer className='bg-white wrapper' fluid style={{overflowX:"hidden", position: "absolute", top: "0", left: "0", width: "100vw"}}>

      <CRow className='d-flex justify-content-center align-items-center flex-grow-1' style={{height: "100vh"}}>
        <CCol xxl={{order: 0, span: 6}} xs={{order: 1, span: 12}}>
          <div className='d-flex flex-column justify-content-center h-100 column-text'>
            <h1 className='text-dashboard-title'><span style={{color: "red"}}>ANDON</span> VISUALIZATION</h1>
            <h3 className='text-dashboard-subtitle' style={{fontWeight: "lighter"}}>Comprehensive solution for monitoring material supply and consumption</h3>
            <div className='d-flex justify-content-start gap-4 mt-4'>
              <CButton className='tag-dashboard' disabled style={{ width: "200px", color: "black"}}>Master</CButton>
              <CButton className='tag-dashboard' disabled style={{ width: "200px", color: "black"}}>History</CButton>
              <CButton className='tag-dashboard' disabled style={{ width: "200px", color: "black"}}>Visualization</CButton>
            </div>
          </div>
        </CCol>
        <CCol xxl={{order: 1, span: 4, offset: 0}} xs={{order: 0, span: 12, offset:0}} className='d-xl-flex d-flex justify-content-center align-items-center column-image'>
          <CImage src={ImageDashboard} className='w-100 image-dashboard'/>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard