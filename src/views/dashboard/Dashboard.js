/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CContainer, CCol, CWidgetStatsD, CRow, CCard, CImage, CButton, CCardTitle, CHeaderText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";
import { CChartLine } from '@coreui/react-chartjs';
import ImageDashboard from '/src/assets/images/dashboard/dashboard_img.png'

import useMaterialDataService from './../../services/MaterialDataService';
import useGentaniDataService from '../../services/GentaniDataService';
import useSetupDataService from '../../services/SetupDataService';
import useSupplyQtyDataService from '../../services/SupplyQtyDataService';
import useMonitoringDataService from '../../services/MonitoringDataService';
import useHistoryDataService from '../../services/HistoryDataService';


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
    <CContainer fluid>
      {/* <CCard className='bg-white p-4' style={{height: "100%"}} > */}
         <CRow>
           <CCol xxl={{order: 0, span: 8}} xs={{order: 1, span: 12}}>
             <div className='d-flex flex-column justify-content-center  h-100'>
               <h1 className='text-dashboard-title'><span style={{color: "red"}}>ANDON</span> VISUALIZATION</h1>
               <h3 className='text-dashboard-subtitle' style={{fontWeight: "lighter"}}>Comprehensive solution for monitoring material supply and consumption</h3>
               <div className='d-flex justify-content-start gap-4 mt-4'>
                  <CButton className='tag-dashboard' disabled style={{border: "2px solid black", width: "150px", color: "black"}}>Master</CButton>
                  <CButton className='tag-dashboard' disabled style={{border: "2px solid black", width: "150px", color: "black"}}>History</CButton>
                  <CButton className='tag-dashboard' disabled style={{border: "2px solid black", width: "150px", color: "black"}}>Visualization</CButton>
               </div>
             </div>
           </CCol>
           <CCol xxl={{order: 1, span: 4, offset: 0}} xs={{order: 0, span: 6, offset:3}} className='h-100'>
             <CImage src={ImageDashboard} className='w-100 image-dashboard'/>
           </CCol>
         </CRow>
        {/* <CCard className='my-4'></CCard> */}
      {/* </CCard> */}
      {/* <h1 className='my-4'>MASTER</h1>
      <CRow>
        <CCol xs={12} xl={2}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilSpreadsheet} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'materials', value: materialData.length },
              // { title: 'gentani', value: gentaniData.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={2}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilCart} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'gentani', value: gentaniData.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={2}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilCog} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'setup', value: setupData.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={2}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilDataTransferUp} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'supply quantity', value: supplyQtyData.length },
              // { title: 'gentani', value: gentaniData.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={2}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilChart} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'monitoring', value: monitoringData.length },
            ]}
          />
        </CCol>    
      </CRow>
      
      <h1 className='pt-5 pb-3'>HISTORY</h1>
      <CRow>
        <CCol xs={12} xl={4}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilGarage} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'consumption', value: historyData.consumption.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={4}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilIndustry} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'supply', value: historyData.supply.length },
            ]}
          />
        </CCol>
      </CRow> */}
      
      
    </CContainer>
  )
}

export default Dashboard