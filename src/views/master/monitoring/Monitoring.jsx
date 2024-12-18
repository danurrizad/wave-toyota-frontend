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
    CInputGroup, 
    CInputGroupText, 
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
    CFormText,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSpinner
} from '@coreui/react'

import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import useMonitoringDataService from '../../../services/MonitoringDataService'
import { useAuth } from '../../../utils/context/authContext';

const Monitoring = () => {
    const auth = useAuth()
    const { getMonitoringData, updateMonitoringData } = useMonitoringDataService()
    const [loading, setLoading] = useState(false)
    const [ monitoringData, setMonitoringData ] = useState([])

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [ formUpdateData, setFormUpdateData ] = useState({})

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
            const response = await getMonitoringData('monitoring')
            setTotalMonitoringData(response.data.data.length)
            setMonitoringData(response.data.data)
            setFilteredData(response.data.data)

        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
            } else{
                addToast(templateToast("Error", error.message))
            }
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
            addToast(templateToast("Success", `Monitoring data for Material No. ${materialNo} updated!`))
        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
            } else {
                addToast(templateToast("Error", error.message))
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        getMonitoring()
    }, [])

    // PAGINATION AND SEARCH
    const [currentPage, setCurrentPage] = useState(1)
    const [totalMonitoringData, setTotalMonitoringData] = useState(0)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [filteredData, setFilteredData] = useState([])

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        visualization_name: "All"
    });

    const handleSearch = () => {
        const { visualization_name } = searchQuery
         const filtered = monitoringData.filter(monitoring => {
            const matchesViz = visualization_name === "All" || monitoring.visualization_name.toLowerCase().includes(visualization_name.toLowerCase())
            return matchesViz
        })
        setFilteredData(filtered);
        setTotalPage(Math.ceil(filtered.length / itemPerPage))
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchQuery({visualization_name: "All"})

        setFilteredData(monitoringData)
        setTotalPage(Math.ceil(monitoringData.length / itemPerPage))
        setCurrentPage(1)
    }


    useEffect(()=>{
        setTotalPage(Math.ceil(filteredData.length / itemPerPage))
    }, [filteredData, itemPerPage])

    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)

    const handleSetItemPerPage = (item) =>{
        setItemPerPage(item)
        setCurrentPage(1)
    }

    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const templateToast = (type, msg) => {
        return(
            <CToast autohide={true}>
                <CToastHeader closeButton>
                    <svg
                    className="rounded me-2 bg-black"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                    >
                    <rect width="100%" height="100%" fill={`${type === 'Error' ? "#e85454" : "#29d93e"}`}></rect>
                    </svg>
                    <div className="fw-bold me-auto">{type}</div>
                    {/* <small>7 min ago</small> */}
                </CToastHeader>
                <CToastBody>{msg}</CToastBody>
            </CToast>
        )
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
                            <CDropdown variant="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
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
                            <CDropdown variant="btn-group" style={{width: "100%"}}  direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.visualization_name}</CDropdownToggle>
                                <CDropdownMenu >
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 1"}))}>Visualization 1</CDropdownItem>
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 2"}))}>Visualization 2</CDropdownItem>
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 3"}))}>Visualization 3</CDropdownItem>
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 4"}))}>Visualization 4</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>updateMonitoring(formUpdateData.material_no, formUpdateData)}>Save update</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}
            </>
        )
    }

    


  return (
    <>
        <CContainer fluid >
            {/* Loading Spinner */}
            { loading && 
            <div className="loading">
                <CSpinner />
            </div>
            }

            {/* Toast */}
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

            {renderModalUpdate()}

            <CRow>
                <CCol xl={4} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2' >Plant</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-6 '>
                            <CDropdown className='d-flex justify-content-between' style={{width: "100%"}}>
                                <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{searchQuery.visualization_name}</CDropdownToggle>
                                <CDropdownMenu className=''>
                                    <CDropdownItem onClick={()=>setSearchQuery({ visualization_name: "All"})}>All</CDropdownItem>
                                    <CDropdownItem onClick={()=>setSearchQuery({ visualization_name: "Visualization 1"})}>Visualization 1</CDropdownItem>
                                    <CDropdownItem onClick={()=>setSearchQuery({ visualization_name: "Visualization 2"})}>Visualization 2</CDropdownItem>
                                    <CDropdownItem onClick={()=>setSearchQuery({ visualization_name: "Visualization 3"})}>Visualization 3</CDropdownItem>
                                    <CDropdownItem onClick={()=>setSearchQuery({ visualization_name: "Visualization 4"})}>Visualization 4</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol className="d-flex justify-content-end gap-2 col-sm-4">
                            <CButton className="btn-search" onClick={()=>handleSearch()}>Search</CButton>
                            <CButton color="secondary" onClick={()=>handleClearSearch()}>Clear</CButton>
                        </CCol >
                    </CRow>
                </CCol>
            </CRow>
            <CRow>
                <CCol className='py-4 text-table-small'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Visualization Name</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((monitoring, index) => {
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(monitoring)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>{monitoring.material_no}</CTableDataCell>
                                        <CTableDataCell>{monitoring.material_desc}</CTableDataCell>
                                        <CTableDataCell>{monitoring.plant}</CTableDataCell>
                                        <CTableDataCell>{monitoring.visualization_name}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                    {paginatedData?.length === 0 && <h2 className='text-center py-4'>No monitoring data found!</h2>}
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={8} xl={6} className='d-flex align-items-end'>
                    <CFormLabel>Showing {totalPage === 0 ? "0" : currentPage} to {totalPage} of {paginatedData?.length} row(s)</CFormLabel>
                </CCol>
                <CCol xs={4} xl={6} className='d-flex align-items-center justify-content-end gap-4'>
                    <CFormLabel htmlFor="size" className='col-form-label' >Size</CFormLabel>
                    <CDropdown>
                        <CDropdownToggle color="white">{itemPerPage}</CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem onClick={() => handleSetItemPerPage(1)}>1</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(2)}>2</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(3)}>3</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(10)}>10</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(25)}>25</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(50)}>50</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(100)}>100</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
                <CCol sm={12} xl={12} className='d-flex align-items-center gap-4 justify-content-center flex-column flex-xl-row py-4'>
                        {/* Custom Pagination Component */}
                        <CPagination className="justify-content-center">
                        {/* Previous Button */}
                        <CPaginationItem
                            disabled={currentPage === 1 || filteredData.length === 0}
                            onClick={() => currentPage > 1 && setCurrentPage(1)}
                        >
                            First
                        </CPaginationItem>
                        <CPaginationItem
                            disabled={currentPage === 1 || filteredData.length === 0}
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </CPaginationItem>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPage }, (_, i) => i + 1)
                            .slice(
                            Math.max(0, currentPage - 2), // Start index for slicing
                            Math.min(totalPage, currentPage + 1) // End index for slicing
                            )
                            .map((page) => (
                            <CPaginationItem
                                key={page}
                                active={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </CPaginationItem>
                            ))}

                        {/* Next Button */}
                        <CPaginationItem
                            disabled={currentPage === totalPage || filteredData.length === 0}
                            onClick={() => currentPage < totalPage && setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </CPaginationItem>
                        <CPaginationItem
                            disabled={currentPage === totalPage || filteredData.length === 0}
                            onClick={() => currentPage < totalPage && setCurrentPage(totalPage)}
                        >
                            Last
                        </CPaginationItem>
                    </CPagination>
                </CCol>
            </CRow>
        </CContainer>
    </>
  )
}

export default Monitoring