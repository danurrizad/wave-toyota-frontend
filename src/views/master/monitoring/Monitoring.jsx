/* eslint-disable prettier/prettier */
'use client' 
import React, { useState, useEffect, useRef} from 'react'
import { 
    CTable, 
    CTableHead, 
    CTableBody, 
    CTableRow, 
    CTableHeaderCell, 
    CTableDataCell, 
    CRow, 
    CCol, 
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem, 
    CFormLabel,
    CContainer,
    CButton,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CToaster,
    CSpinner
} from '@coreui/react'
import Select from "react-select"

import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import useMonitoringDataService from '../../../services/MonitoringDataService'
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';
import SizePage from '../../../components/pagination/SizePage';
import Pagination from '../../../components/pagination/Pagination';

const Monitoring = () => {
    const auth = useAuth()
    const { getMonitoringData, updateMonitoringData } = useMonitoringDataService()
    const [loading, setLoading] = useState(false)
    const [ monitoringData, setMonitoringData ] = useState([])

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [ formUpdateData, setFormUpdateData ] = useState({})
    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        visualization_name: ""
    });
    const optionsVisualizationName = [
        { label: "Visualization 1 [Plant 1]", value: "Visualization 1" },
        { label: "Visualization 2 [Plant 1]", value: "Visualization 2" },
        { label: "Visualization 3 [Plant 1]", value: "Visualization 3" },
        { label: "Visualization 4 [Plant 2]", value: "Visualization 4" },
        { label: "Visualization 5 [Plant 2]", value: "Visualization 5" },
        { label: "Visualization 6 [Plant 2]", value: "Visualization 6" },
    ]

    const handleModalUpdate = (dataMonitor) =>{
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: dataMonitor.material_no,
            material_desc: dataMonitor.material_desc,
            plant: dataMonitor.plant,
            visualization_name: dataMonitor.visualization_name
        })
    }

    const getMonitoring = async() => {
        try {
            setLoading(true)
            const response = await getMonitoringData('monitoring', searchQuery.visualization_name)
            setMonitoringData(response.data.data)
            setFilteredData(response.data.data)
            setTotalPage(Math.ceil(response.data.data.length / itemPerPage))
            setCurrentPage(1)
        } catch (error) {
            console.error(error)
            setMonitoringData([])
            setFilteredData([])
            setTotalPage(0)
            setCurrentPage(1)
        } finally{
            setLoading(false)
        }
    }

    const updateMonitoring = async(materialNo, form) => {
        try {
            setLoading(true)
            const response = await updateMonitoringData('monitoring', materialNo, form)
            getMonitoring()
            setVisibleModalUpdate(false)
            addToast(templateToast("Success", response.data.message))
            validateTotalVisualization()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        getMonitoring()
    }, [searchQuery])

    const validateTotalVisualization = (name) => {
        const total = monitoringData.filter(
            (monitoring) => monitoring.visualization_name === name
        ).length;
        return total < 6; // Return true if less than 6, false otherwise
    };
    

    // PAGINATION AND SEARCH
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [filteredData, setFilteredData] = useState([])

    useEffect(()=>{
        setTotalPage(Math.ceil(filteredData.length / itemPerPage))
    }, [filteredData, itemPerPage])

    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)

    const handleSetItemPerPage = (item) =>{
        setItemPerPage(item)
        setCurrentPage(1)
    }
   
    const renderModalUpdate = () =>{
        return(
            <>
                {/* Start of Modal Update */}
            <CModal
                backdrop="static"
                visible={visibleModalUpdate}
                onClose={() => setVisibleModalUpdate(false)}
                aria-labelledby="UpdateMonitoringData"
                >
                <CModalHeader>
                    <CModalTitle id="UpdateMonitoringData">Update Monitoring Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Material No</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialNo" disabled value={formUpdateData.material_no || ""} />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialDesc" className="col-sm-4 col-form-label">Material Desc</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialDesc" disabled value={formUpdateData.material_desc || ""}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Plant</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.plant}</CDropdownToggle>
                                <CDropdownMenu >
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P1 - PLANT 1"}))}>P1 - PLANT 1</CDropdownItem>
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P2 - PLANT 2"}))} >P2 - PLANT 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Visualization Name<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}}  direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.visualization_name}</CDropdownToggle>
                                {formUpdateData.plant === "P1 - PLANT 1" && (
                                    <CDropdownMenu className='cursor-pointer'>
                                        { validateTotalVisualization("Visualization 1") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 1"}))}>Visualization 1</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 2") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 2"}))}>Visualization 2</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 3") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 3"}))}>Visualization 3</CDropdownItem>}
                                        <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: ""}))}>Remove</CDropdownItem>
                                    </CDropdownMenu>
                                )}
                                {formUpdateData.plant === "P2 - PLANT 2" && (
                                    <CDropdownMenu className='cursor-pointer'>
                                        { validateTotalVisualization("Visualization 4") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 4"}))}>Visualization 4</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 5") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 5"}))}>Visualization 5</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 6") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 6"}))}>Visualization 6</CDropdownItem>}
                                        <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: ""}))}>Remove</CDropdownItem>
                                    </CDropdownMenu>
                                )}
                            </CDropdown>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master d-flex align-items-center gap-2' disabled={loading} onClick={()=>updateMonitoring(formUpdateData.material_no, formUpdateData)}>
                        { loading && <CSpinner size='sm'/>}
                        Save update
                    </CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}
            </>
        )
    }

    


  return (
    <>
        <CContainer fluid >
            {renderModalUpdate()}

            <CRow>
                <CCol xl={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xxl-2 col-xl-3' >Visualization</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-8 col-xl-6'>
                            <Select
                                options={optionsVisualizationName}
                                value={optionsVisualizationName.find((opt)=>opt.value === searchQuery.visualization_name) || ""}
                                onChange={(e)=>setSearchQuery({ ...searchQuery, visualization_name: e!== null ? e.value : ""})}
                                isClearable
                                className='w-100'
                                placeholder="All"
                            />
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
            <CRow className='mt-3'>
                <p><span style={{fontWeight: "bold"}}>Note</span>: A maximum of 6 materials can be displayed in a single visualization</p>
            </CRow>
            <CRow>
                <CCol className='py-4 pt-2 text-table-small'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: 'center' }}>
                                { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell> }
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Visualization Name</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            { (paginatedData.length > 0 && !loading) && paginatedData.map((monitoring, index) => {
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }}>
                                        { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && (
                                            <CTableDataCell className='text-center'>
                                                <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(monitoring)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                            </CTableDataCell>
                                        )}
                                        <CTableDataCell>{monitoring.material_no}</CTableDataCell>
                                        <CTableDataCell>{monitoring.material_desc}</CTableDataCell>
                                        <CTableDataCell>{monitoring.plant}</CTableDataCell>
                                        <CTableDataCell>{monitoring.visualization_name}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                            { paginatedData.length === 0 && !loading && 
                                <CTableRow color="light">
                                    <CTableDataCell color="light" colSpan={5}>
                                        <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                            <CIcon icon={icon.cilFax} size='3xl'/>
                                            <p className='pt-3'>No data found!</p>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            }
                            { loading && 
                            <CTableRow color=''>
                                    <CTableDataCell colSpan={100}>
                                        <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                            <CSpinner/>
                                            <p className='pt-3'>Loading data</p>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            }
                        </CTableBody>
                    </CTable>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={8} xl={6} className='d-flex align-items-end'>
                    <CFormLabel>Showing {totalPage === 0 ? "0" : currentPage} to {totalPage} of {paginatedData?.length} row(s)</CFormLabel>
                </CCol>
                <CCol xs={4} xl={6} className='d-flex align-items-center justify-content-end gap-4'>
                    <SizePage
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                </CCol>
                <CCol sm={12} xl={12} className='d-flex align-items-center gap-4 justify-content-center flex-column flex-xl-row py-4'>
                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        setCurrentPage={setCurrentPage}
                        data={filteredData}
                    />
                </CCol>
            </CRow>
        </CContainer>
    </>
  )
}

export default Monitoring