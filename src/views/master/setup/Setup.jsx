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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";
import Select from "react-select"

import useSetupDataService from './../../../services/SetupDataService';
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';
import SizePage from '../../../components/pagination/SizePage';
import Pagination from '../../../components/pagination/Pagination';
import { useToast } from '../../../App';

dayjs.extend(utc);
dayjs.extend(timezone);

const Setup = () => {
    const auth = useAuth()
    const addToast = useToast()
    const [ setupData, setSetupData ] = useState([])
    const { getSetupData, updateSetupData } = useSetupDataService()

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [formUpdateData, setFormUpdateData] = useState({})

    const handleModalUpdate = (setupData) => {
        const now = dayjs().tz('Asia/Jakarta').format()
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: setupData.material_no,
            material_desc: setupData.material_desc,
            plant: setupData.plant,
            supply_line: setupData.supply_line,
            standard_supply: setupData.standard_supply,
            critical_stock: setupData.critical_stock,
            total: setupData.total,
            updated_by: auth.user,
            changed_date: now
        })
    }

    // PAGINATION AND SEARCH
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [filteredData, setFilteredData] = useState([])
   
    const optionsPlant = [
        { label: "P1 - PLANT 1", value: "P1 - PLANT 1" },
        { label: "P2 - PLANT 2", value: "P2 - PLANT 2" },
    ]

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        plant: ""
    });


    useEffect(() => {
        setTotalPage(Math.ceil(filteredData.length / itemPerPage));
    }, [filteredData, itemPerPage]);


    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)

    const getSetup = async() => {
        try {
            setLoading(true)
            const response = await getSetupData('setup', searchQuery.plant);
           
            setSetupData(response.data.data)
            setFilteredData(response.data.data)
            setTotalPage(response.data.data.length / itemPerPage)
            setCurrentPage(1)
        } catch (error) {
            console.error(error)
            setFilteredData([])
            setTotalPage(0)
            setCurrentPage(1)
        } finally{
            setLoading(false)
        }
    }

    const updateSetup = async(form) => {
        try {
            setLoading(true)
            const response = await updateSetupData('setup', form.material_no, form)
            addToast(response.data.message, 'success', 'sucess')
            getSetup()
            setVisibleModalUpdate(false)
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getSetup()
    }, [searchQuery])
    

  return (
    <>
        <CContainer fluid >
            
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
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.plant}</CDropdownToggle>
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
                    <CButton className='btn-add-master d-flex align-items-center gap-2' disabled={loading} onClick={()=>updateSetup(formUpdateData)}>
                        {loading && <CSpinner size='sm'/>}
                        Save update</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}

            <CRow>
                <CCol xl={4} lg={6} md={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xl-1' >Plant</CFormLabel>
                        <Select
                            options={optionsPlant}
                            value={optionsPlant.find((opt)=>opt.value === searchQuery.plant) || ""}
                            onChange={(e)=>setSearchQuery({ ...searchQuery, plant: e!==null ? e.value : ""})}
                            isClearable
                            className='w-100'
                        />
                    </CRow>
                </CCol>
            </CRow>
            <CRow className='pt-4'>
                <CCol xxl={2} md={3} sm={4} xs={5} className='d-flex align-items-center gap-1'>
                    <div style={{ width: "30px", height: "30px", backgroundColor: "#F2E4C6"}}></div>
                    <p>Need to be supplied</p>
                </CCol>
                <CCol className='d-flex align-items-center gap-1'>
                    <div style={{ width: "30px", height: "30px", backgroundColor: "#FADDDD"}}></div>
                    <p>At critical stock</p>
                </CCol>
            </CRow>
            <CRow>
                <CCol className='py-4 text-table-small'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{backgroundColor: "blue", textAlign: "center", verticalAlign: "middle"}}>
                                { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell> }
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
                                <CTableHeaderCell scope="col">Changed Time</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            { (paginatedData.length > 0 && !loading) && paginatedData.map((setup, index) => {
                                    return(
                                        <CTableRow color={setup.total < setup.standard_supply && setup.total > setup.critical_stock ? "warning" : setup.total < setup.critical_stock ? "danger" : ""} key={index} style={{ verticalAlign: "middle", backgroundColor: "black" }}>
                                            { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && (
                                                <CTableDataCell className='text-center'>
                                                    <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(setup)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                                </CTableDataCell>
                                            )}
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
                                            <CTableDataCell>{setup.changed_date ? new Date(setup.changed_date).toLocaleDateString('en-CA') : ""}</CTableDataCell>
                                            <CTableDataCell>{setup.changed_date ? new Date(setup.changed_date).toLocaleTimeString('id-ID').replaceAll('.',':').slice(0, 5) : ""}</CTableDataCell>
                                        </CTableRow>
                                    )
                                } )}
                            { paginatedData.length === 0 && !loading && 
                                <CTableRow color="light">
                                    <CTableDataCell color="light" colSpan={100}>
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

export default Setup