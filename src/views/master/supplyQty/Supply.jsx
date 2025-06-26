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
import Select from "react-select"

import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import QRCode from 'react-qr-code';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import useSupplyQtyDataService from '../../../services/SupplyQtyDataService'
import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';
import Pagination from '../../../components/pagination/Pagination';
import SizePage from '../../../components/pagination/SizePage';

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
        uom: "",
        pack: "",
        qty_pack: 0,
        qty_uom: 0
    })

    const [ visibleModalUpdate, setVisibleModalUpdate ] = useState(false)
    const [formUpdateData, setFormUpdateData] = useState({})

    // PAGINATION AND SEARCH
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    // FILTER 
    const optionsPlant = [
        { label: "P1 - PLANT 1", value: "P1 - PLANT 1" },
        { label: "P2 - PLANT 2", value: "P2 - PLANT 2" }
    ]
    const [searchQuery, setSearchQuery] = useState({
        plant: ""
    });

    const handleModalUpdate = (supplyData) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: supplyData.material_no,
            material_desc: supplyData.material_desc,
            plant: supplyData.plant,
            qty: supplyData.qty,
            uom: supplyData.uom,
            pack: supplyData.pack,
            updated_by: auth.user
        })
    }

    const getSupplyQty = async() =>{
        try {
            setLoading(true)
            const response = await getSupplyQtyData('supply-qty', searchQuery.plant)
            setSupplyQtyData(response.data.data)
            setFilteredData(response.data.data)
            setTotalPage(Math.ceil(response.data.data.length / itemPerPage))
            setCurrentPage(1)
        } catch (error) {
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
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
    }, [searchQuery])


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
                        <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Pack</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="uom" disabled value={formUpdateData.pack || ""}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">Qty/Pack</CFormLabel>
                        <CCol xs={4}>
                            <CFormInput 
                                type="number" 
                                id="qty" 
                                value={formUpdateData.qty || ""} 
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      updateSupplyQty(formUpdateData.material_no, formUpdateData);
                                    }
                                  }} 
                                onChange={(e) => setFormUpdateData((prev) => ({ ...prev, qty: e.target.value }))}
                            />
                        </CCol>
                        <CCol xs={4} className='d-flex align-items-center'>
                            <p>{formUpdateData.uom}</p>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton 
                        className='btn-add-master d-flex align-items-center gap-2' disabled={loading}
                        onClick={()=>updateSupplyQty(formUpdateData.material_no, formUpdateData)}
                    >
                        { loading && <CSpinner size='sm'/>}
                        Save update
                    </CButton>
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
            pack: data.pack,
            qty_uom: data.qty,
            qty_pack: 1
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
                            value={`${dataQR.material_no}, ${dataQR.material_desc}, ${dataQR.plant}, ${dataQR.uom}, ${dataQR.pack}, ${dataQR.qty_pack}, ${dataQR.qty_uom}`}
                            bgColor="white"
                            fgColor="black"
                            size={300}
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
                                <CTableDataCell align='top'>Pack</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.pack}</CTableDataCell>
                            </CTableRow>
                            <CTableRow className=''>
                                <CTableDataCell align='top'>{`Quantity/Pack`}</CTableDataCell>
                                <CTableDataCell align='top' className='px-2'>:</CTableDataCell>
                                <CTableDataCell align='top'>{dataQR.qty_uom ? dataQR.qty_uom : 0} {dataQR.uom}</CTableDataCell>
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
            {/* Toast */}
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

            {renderModalUpdate()}

            {renderModalQR()}

            <CRow>
                <CCol xl={4} lg={6} md={6} xs={12}  >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-sm-2 col-xl-1' >Plant</CFormLabel>
                        <Select
                            options={optionsPlant}
                            value={optionsPlant.find((opt)=>opt.value === searchQuery.plant) || ""}
                            onChange={(e)=>setSearchQuery({ ...searchQuery, plant: e !== null ? e.value : ""})}
                            isClearable
                            placeholder="All"
                            className='w-100'
                        />
                        
                    </CRow>
                </CCol>
            </CRow>
            <CRow>
                <CCol className='py-4 text-table-small'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && <CTableHeaderCell scope="col" className='text-center'>Action</CTableHeaderCell> }
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Uom</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Pack</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">QR Code</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            { (paginatedData.length > 0 && !loading) && paginatedData.map((supply, index) => {
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }}>
                                        { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && (
                                            <CTableDataCell className='text-center'>
                                                <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(supply)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                            </CTableDataCell>
                                        )}
                                        <CTableDataCell>{supply.material_no}</CTableDataCell>
                                        <CTableDataCell>{supply.material_desc}</CTableDataCell>
                                        <CTableDataCell>{supply.plant}</CTableDataCell>
                                        <CTableDataCell>{supply.qty}</CTableDataCell>
                                        <CTableDataCell>{supply.uom}</CTableDataCell>
                                        <CTableDataCell>{supply.pack}</CTableDataCell>
                                        <CTableDataCell>{supply.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(supply.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{supply.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(supply.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalQR(supply)}><CIcon icon={icon.cilClone}/></CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                            { paginatedData.length === 0 && !loading && 
                                <CTableRow color="light">
                                    <CTableDataCell color="light" colSpan={12}>
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

export default Supply