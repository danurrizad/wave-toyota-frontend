/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
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

import QRCode from 'react-qr-code';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import useSupplyQtyDataService from '../../../services/SupplyQtyDataService'
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';

const Supply = () => {
    const auth = useAuth()
    const { getSupplyQtyData, updateSupplyQtyData } = useSupplyQtyDataService()
    const [ supplyQtyData, setSupplyQtyData ] = useState([])
    const [ filteredData, setFilteredData ] = useState([])

    const [visibleModalQR, setVisibleModalQR] = useState(false)
    const [dataQR, setDataQR] = useState({
        material_no: "",
        material_desc: "",
        plant: "",
        uom: ""
    })

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [formUpdateData, setFormUpdateData] = useState({})

    const handleModalUpdate = (supplyData) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: supplyData.material_no,
            material_desc: supplyData.material_desc,
            plant: supplyData.plant,
            qty: supplyData.qty,
            uom: supplyData.uom,
            updated_by: auth.user
        })
    }

    const getSupplyQty = async() =>{
        try {
            setLoading(true)
            const response = await getSupplyQtyData('supply-qty')
            setSupplyQtyData(response.data.data)
            setFilteredData(response.data.data)
        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.message))
            }
            else{
                addToast(templateToast("Error", error.message))
            }
        } finally{
            setLoading(false)
        }
    }

    const updateSupplyQty = async(materialNo, body) => {
        try {
            setLoading(true)
            const response = await updateSupplyQtyData('supply-qty', materialNo, body)
            getSupplyQty()
            setVisibleModalUpdate(false)
            addToast(templateToast("Success", response.data.message))
        } catch (error) {
            if (error.response) {
                addToast(templateToast("Error", error.response.data.message));
            } 
            else {
                addToast(templateToast("Error", "An unexpected error occurred."));
            }
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getSupplyQty()
    }, [])

    // PAGINATION AND SEARCH
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        plant: "All"
    });

    const handleSearch = () => {
        const { plant } = searchQuery 

        const filtered = supplyQtyData.filter(supply => {
            const matchesPlant = plant === "All" || supply.plant.toLowerCase().includes(plant.toLowerCase())
            return matchesPlant
        })

        setFilteredData(filtered)
        setTotalPage(Math.ceil(filtered.length / itemPerPage))
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchQuery({plant: "All"})
        setFilteredData(supplyQtyData)
        setTotalPage(Math.ceil(supplyQtyData.length / itemPerPage))
        setCurrentPage(1)
    }

    const handleSetItemPerPage = (item) => {
        setItemPerPage(item)
        setCurrentPage(1)
    }


    useEffect(() => {
        setTotalPage(Math.ceil(filteredData.length / itemPerPage));
    }, [filteredData, itemPerPage]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);

    const renderModalUpdate = () =>{
        return(
            <>
                {/* Start of Modal Update */}
            <CModal
                backdrop="static"
                visible={visibleModalUpdate}
                onClose={() => setVisibleModalUpdate(false)}
                aria-labelledby="UpdateSupplyData"
                >
                <CModalHeader>
                    <CModalTitle id="UpdateSupplyData">Update Supply Data</CModalTitle>
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
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Uom</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="uom" disabled value={formUpdateData.uom || ""}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">Qty</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="qty" value={formUpdateData.qty || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, qty: e.target.value }))}/>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>updateSupplyQty(formUpdateData.material_no, formUpdateData)}>Save update</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}
            </>
        )
    }

    //   QR CODE
    const handleModalQR = (data) => {
        setVisibleModalQR(true)
        setDataQR({ 
            material_no: data.material_no,
            material_desc: data.material_desc,
            plant: data.plant,
            uom: data.uom,
            qty: data.qty
        })
    }

    const renderModalQR = () => {
        return(
            <CModal
                visible={visibleModalQR}
                onClose={() => setVisibleModalQR(false)}
                aria-labelledby="QRmaterial"
                >
                <CModalHeader>
                    <CModalTitle id="QRmaterial">QR Code Material</CModalTitle>
                </CModalHeader>
                <CModalBody id="qr-content">
                    <CRow>
                        <h2 className='text-center py-2'>{dataQR.material_no}</h2>
                    </CRow>
                    <CRow>
                        <QRCode
                            title={`QR Code for ${dataQR.material_no}`}
                            value={`${dataQR.material_no}, ${dataQR.material_desc}, ${dataQR.plant}, ${dataQR.uom}, ${dataQR.qty}`}
                            bgColor="white"
                            fgColor="black"
                            size={400}
                        />
                    </CRow>
                    <CRow className='px-4 pt-4'>
                        <CTable >
                            <CTableRow className=''>
                                <CTableDataCell align='top'>Material No</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.material_no}</CTableDataCell>
                            </CTableRow>
                            <CTableRow className=''>
                                <CTableDataCell align='top'>Material Desc</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.material_desc}</CTableDataCell>
                            </CTableRow>
                            <CTableRow className=''>
                                <CTableDataCell align='top'>Plant</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.plant}</CTableDataCell>
                            </CTableRow>
                            <CTableRow className=''>
                                <CTableDataCell align='top'>Uom</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.uom}</CTableDataCell>
                            </CTableRow>
                            <CTableRow className=''>
                                <CTableDataCell align='top'>Quantity</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.qty}</CTableDataCell>
                            </CTableRow>
                        </CTable>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalQR(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handlePrint(dataQR)}>Print</CButton>
                </CModalFooter>
            </CModal>
        )
    }

    const handlePrint = async (data) => {
        const modalElement = document.getElementById("qr-content");

        if (modalElement) {
            // Capture the modal content as an image
            const canvas = await html2canvas(modalElement, { scale: 3 });
            const imgData = canvas.toDataURL("image/png");

            // A5 dimensions in points
            const pdfWidth = 419.53; // A5 width in points
            const pdfHeight = 595.28; // A5 height in points

            // Calculate dimensions for the image to fit A5
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: [pdfWidth, pdfHeight], // Set A5 dimensions
            });

            // Add the image to the PDF and handle overflow if the height exceeds A5 size
            let yPosition = 0;
            if (imgHeight <= pdfHeight) {
                // Image fits in a single page
                pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
            } else {
                // Image exceeds A5, split into pages
                while (yPosition < imgHeight) {
                    pdf.addImage(
                        imgData,
                        "PNG",
                        0,
                        -yPosition, // Negative offset for the current page
                        imgWidth,
                        imgHeight
                    );
                    yPosition += pdfHeight; // Move to the next page
                    if (yPosition < imgHeight) pdf.addPage(); // Add a new page if needed
                }
            }

            pdf.save(`QR_Material_${data.material_no}.pdf`);
            // pdf.save({`QR_Material_${data.material_no}.pdf`});
        }
    };

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

            {renderModalQR()}

            <CRow>
                <CCol xl={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xl-1' >Plant</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-8 col-xl-6'>
                            <CDropdown className='dropdown-search d-flex justify-content-between'>
                                <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ plant: "All"})}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ plant: "P1 - Plant 1"})}>P1 - Plant 1</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({ plant: "P2 - Plant 2"})}>P2 - Plant 2</CDropdownItem>
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
                            <CTableRow color="dark" >
                            <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Uom</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">QR Code</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((supply, index) => {
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(supply)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>{supply.material_no}</CTableDataCell>
                                        <CTableDataCell>{supply.material_desc}</CTableDataCell>
                                        <CTableDataCell>{supply.plant}</CTableDataCell>
                                        <CTableDataCell>{supply.qty}</CTableDataCell>
                                        <CTableDataCell>{supply.uom}</CTableDataCell>
                                        <CTableDataCell>{supply.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(supply.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{supply.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(supply.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalQR(supply)}><CIcon icon={icon.cilClone}/></CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                    {paginatedData?.length === 0 && <h2 className='text-center py-4'>No supply data found!</h2>}
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

export default Supply