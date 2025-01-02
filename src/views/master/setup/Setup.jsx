/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react'
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

import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import useSetupDataService from './../../../services/SetupDataService';
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';

const Setup = () => {
    const auth = useAuth()
    const [ setupData, setSetupData ] = useState([])
    const { getSetupData, updateSetupData } = useSetupDataService()

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [formUpdateData, setFormUpdateData] = useState({})

    const handleModalUpdate = (setupData) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: setupData.material_no,
            material_desc: setupData.material_desc,
            plant: setupData.plant,
            supply_line: setupData.supply_line,
            standard_supply: setupData.standard_supply,
            critical_stock: setupData.critical_stock,
            total: setupData.total,
            updated_by: auth.user
        })
    }

    // PAGINATION AND SEARCH
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [filteredData, setFilteredData] = useState([])
    const [toast, addToast] = useState(0)
    const toaster = useRef()
   

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        plant: "All"
    });

    const handleSearch = () => {
        const { plant } = searchQuery
        
        const filtered = setupData.filter(setup => {
            const matchesPlant = plant === "All" || setup.plant.toLowerCase().includes(plant.toLowerCase())
            return matchesPlant
        })

        setFilteredData(filtered)
        setTotalPage(Math.ceil(filtered.length / itemPerPage))
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchQuery({plant: "All"})
        setFilteredData(setupData)
        setTotalPage(Math.ceil(setupData.length / itemPerPage))
        setCurrentPage(1)
    }

    const handleSetItemPerPage = (item) => {
        setItemPerPage(item)
        setCurrentPage(1)
    }


    useEffect(() => {
        setTotalPage(Math.ceil(filteredData.length / itemPerPage));
    }, [filteredData, itemPerPage]);


    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)



    const getSetup = async() => {
        try {
            setLoading(true)
            const response = await getSetupData('setup');
            setSetupData(response.data.data)
            setFilteredData(response.data.data)
        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
            }else{
                addToast(templateToast("Error", error.message))
            }
        } finally{
            setLoading(false)
        }
    }

    const updateSetup = async(form) => {
        try {
            setLoading(true)
            const response = await updateSetupData('setup', form.material_no, form)
            addToast(templateToast("Success", response.data.message))
            getSetup()
            setVisibleModalUpdate(false)
        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
            }else{
                addToast(templateToast("Error", error.message))
            }
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getSetup()
    }, [])
    

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
            <CToaster key={setupData.material_no} className="p-3" placement="top-end" push={toast} ref={toaster} />
            
            {/* Start of Modal Update */}
            <CModal
                backdrop="static"
                visible={visibleModalUpdate}
                onClose={() => setVisibleModalUpdate(false)}
                aria-labelledby="UpdateSetupData"
                >
                <CModalHeader>
                    <CModalTitle id="UpdateSetupData">Update Setup Data</CModalTitle>
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
                            <CDropdown download="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.plant}</CDropdownToggle>
                                <CDropdownMenu >
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P1 - PLANT 1"}))}>P1 - PLANT 1</CDropdownItem>
                                    <CDropdownItem onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P2 - PLANT 2"}))} >P2 - PLANT 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="supplyLine" className="col-sm-4 col-form-label">Supply Line</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="supplyLine" disabled value={formUpdateData.supply_line || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, supply_line: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="standardStock" className="col-sm-4 col-form-label">Standard Supply</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="standardStock" value={formUpdateData.standard_supply || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, standard_supply: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="criticalStock" className="col-sm-4 col-form-label">Critical Stock</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="criticalStock" value={formUpdateData.critical_stock || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, critical_stock: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="total" className="col-sm-4 col-form-label">Total</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="total" value={formUpdateData.total || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, total: e.target.value }))}/>
                        </CCol>
                    </CRow>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>updateSetup(formUpdateData)}>Save update</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}

            <CRow>
                <CCol xl={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xl-1' >Plant</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-8 col-xl-6'>
                            <CDropdown className='dropdown-search d-flex justify-content-between'>
                                <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({plant: "All"})}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({plant: "P1 - Plant 1"})}>P1 - Plant 1</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({plant: "P2 - Plant 2"})}>P2 - Plant 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol className="d-flex justify-content-end gap-3 col-sm-2 col-xl-2">
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
                            <CTableRow color="dark" style={{backgroundColor: "blue"}}>
                            <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Supply Line</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Minimal Supply</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Critical Stock</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Current Stock</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed Date</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((setup, index) => {
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(setup)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>{setup.material_no}</CTableDataCell>
                                        <CTableDataCell>{setup.material_desc}</CTableDataCell>
                                        <CTableDataCell>{setup.plant}</CTableDataCell>
                                        <CTableDataCell>{setup.supply_line}</CTableDataCell>
                                        <CTableDataCell>{setup.standard_supply}</CTableDataCell>
                                        <CTableDataCell>{setup.critical_stock}</CTableDataCell>
                                        <CTableDataCell>{setup.total}</CTableDataCell>
                                        <CTableDataCell>{setup.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(setup.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{setup.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(setup.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                    {paginatedData?.length === 0 && !loading && <h2 className='text-center py-4'>No setup data found!</h2>}
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

export default Setup