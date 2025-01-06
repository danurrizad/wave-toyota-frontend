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

import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import useMonitoringDataService from '../../../services/MonitoringDataService'
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';

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
            addToast(templateToast("Success", response.data.message))
            validateTotalVisualization()
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
    const [toast, addToast] = useState(0)
    const toaster = useRef()

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
                                    </CDropdownMenu>
                                )}
                                {formUpdateData.plant === "P2 - PLANT 2" && (
                                    <CDropdownMenu className='cursor-pointer'>
                                        { validateTotalVisualization("Visualization 4") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 4"}))}>Visualization 4</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 5") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 5"}))}>Visualization 5</CDropdownItem>}
                                        { validateTotalVisualization("Visualization 6") && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, visualization_name: "Visualization 6"}))}>Visualization 6</CDropdownItem>}
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
                <CCol xl={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xxl-2 col-xl-3' >Visualization</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-8 col-xl-6'>
                            <CDropdown className='dropdown-search d-flex justify-content-between'>
                                <CDropdownToggle className='d-flex justify-content-between align-items-center dropdown-search'>{searchQuery.visualization_name}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "All"})}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 1"})}>Visualization 1 (Plant 1)</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 2"})}>Visualization 2 (Plant 1)</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 3"})}>Visualization 3 (Plant 1)</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 4"})}>Visualization 4 (Plant 2)</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 5"})}>Visualization 5 (Plant 2)</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ visualization_name: "Visualization 6"})}>Visualization 6 (Plant 2)</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol className="d-flex justify-content-end gap-2 col-sm-2 col-xl-2">
                            <CButton className="btn-search" onClick={()=>handleSearch()}>Search</CButton>
                            <CButton color="secondary" onClick={()=>handleClearSearch()}>Clear</CButton>
                        </CCol >
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
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }}>
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
                    {paginatedData?.length === 0 && !loading && <h2 className='text-center py-4'>No monitoring data found!</h2>}
                    {loading && <h2 className='text-center py-4'>...</h2>}
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
                        <CDropdownMenu className='cursor-pointer'>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(10)}>10</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(25)}>25</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(50)}>50</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(100)}>100</CDropdownItem>
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