/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CContainer, CCol, CWidgetStatsD, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";
import { CChartLine } from '@coreui/react-chartjs';

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
      <h1 className='mb-3'>MASTER</h1>
      <CRow>
        <CCol xs={12} xl={4}>
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
        <CCol xs={12} xl={4}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilCart} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'gentani', value: gentaniData.length },
            ]}
          />
        </CCol>
        <CCol xs={12} xl={4}>
          <CWidgetStatsD
            className="mb-3"
            icon={<CIcon className="my-4 text-black" icon={icon.cilCog} height={52} />}
            style={{ '--cui-card-cap-bg': 'white' }}
            values={[
              { title: 'setup', value: setupData.length },
            ]}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} xl={4}>
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
        <CCol xs={12} xl={4}>
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
      </CRow>
      
      
    </CContainer>
  )
}

export default Dashboard