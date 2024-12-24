/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CContainer, CCol, CWidgetStatsD, CRow, CCard, CImage, CButton, CCardTitle, CHeaderText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";
import { CChartLine } from '@coreui/react-chartjs';
// import ImageDashboard from '/src/assets/images/dashboard/dashboard_img.png'
import ImageDashboard from '/src/assets/images/dashboard/dashboard_img_2.png'

import useMaterialDataService from './../../services/MaterialDataService';
import useGentaniDataService from '../../services/GentaniDataService';
import useSetupDataService from '../../services/SetupDataService';
import useSupplyQtyDataService from '../../services/SupplyQtyDataService';
import useMonitoringDataService from '../../services/MonitoringDataService';
import useHistoryDataService from '../../services/HistoryDataService';
import CardBody from 'rsuite/esm/Card/CardBody';


const Dashboard = () => {
  const { getMaterialData } = useMaterialDataService()
  const { getGentaniData } = useGentaniDataService()
  const { getSetupData } = useSetupDataService()
  const { getSupplyQtyData } = useSupplyQtyDataService()
  const { getMonitoringData } = useMonitoringDataService()
  const { getConsumptionHistory, getSupplyHistory } = useHistoryDataService()

  const [ materialData, setMaterialData ] = useState(false)
  const [ gentaniData, setGentaniData ] = useState(false)
  const [ setupData, setSetupData ] = useState(false)
  const [ supplyQtyData, setSupplyQtyData ] = useState(false)
  const [ monitoringData, setMonitoringData ] = useState(false)
  const [ historyData, setHistoryData ] = useState({
    consumption: [],
    supply: []
  })

  const getMaterial = async() => {
    try {
      const response = await getMaterialData('material')
      setMaterialData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getGentani = async() => {
    try {
      const response = await getGentaniData('gentani')
      setGentaniData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const getSetup = async() => {
    try {
      const response = await getSetupData('setup')
      setSetupData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getSupplyQty = async() => {
    try {
      const response = await getSupplyQtyData('supply-qty')
      setSupplyQtyData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getMonitoring = async() => {
    try {
      const response = await getMonitoringData('monitoring')
      setMonitoringData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getHistory = async() => {
    try {
      const responseConsumption = await getConsumptionHistory()
      const responseSupply = await getSupplyHistory()
      setHistoryData({
        consumption: responseConsumption.data.data,
        supply: responseSupply.data.data
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getMaterial()
    getGentani()
    getSetup()
    getSupplyQty()
    getMonitoring()
    getHistory()
  }, [])

  return (
    <CContainer className='bg-white wrapper' fluid style={{overflowX:"hidden", position: "absolute", top: "0", left: "0", width: "100vw"}}>
      <CRow className='d-flex justify-content-center align-items-center flex-grow-1' style={{height: "100vh"}}>
        <CCol xxl={{order: 0, span: 6}} xs={{order: 1, span: 12}}>
          <div className='d-flex flex-column justify-content-center h-100 column-text'>
            <h1 className='text-dashboard-title'><span style={{color: "red"}}>ANDON</span> VISUALIZATION</h1>
            <h3 className='text-dashboard-subtitle' style={{fontWeight: "lighter"}}>Comprehensive solution for monitoring material supply and consumption</h3>
            <div className='d-flex justify-content-start gap-4 mt-4'>
              {/* <button disabled className="btn-dashboard">
                <svg width="180px" height="60px" viewBox="0 0 180 60" className="border dashboard">
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                </svg>
                <span>Master</span>
              </button>
              <button disabled className="btn-dashboard">
                <svg width="180px" height="60px" viewBox="0 0 180 60" className="border dashboard2">
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                </svg>
                <span>History</span>
              </button>
              <button disabled className="btn-dashboard">
                <svg width="180px" height="60px" viewBox="0 0 180 60" className="border dashboard">
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                  <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                </svg>
                <span>Visualization</span>
              </button> */}
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