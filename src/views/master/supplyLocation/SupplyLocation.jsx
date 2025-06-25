/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
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
    CFormLabel,
    CContainer,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CSpinner
} from '@coreui/react'
import Select from 'react-select'

import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import QRCode from 'react-qr-code';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


import Pagination from '../../../components/pagination/Pagination';
import SizePage from '../../../components/pagination/SizePage';
import useSupplyLocationService from '../../../services/SupplyLocation';
import useMaterialDataService from '../../../services/MaterialDataService';
import { useAuth } from '../../../utils/context/authContext';
import { useToast } from '../../../App';
import { useNavigate } from 'react-router-dom';

const SupplyLocation = () => {
    const auth = useAuth()
    const addToast = useToast()
    const [loading, setLoading] = useState({
        fetch: true,
        submit: false
    })
    const [showModal, setShowModal] = useState({
        type: "",
        add: false,
        update: false,
        delete: false
    })
    const [showModalQR, setShowModalQR] = useState(false)
    const navigate = useNavigate()

    const { getSupplyLocationAll, createSupplyLocation, updateSupplyLocation, deleteSupplyLocationByName } = useSupplyLocationService()
    const { getMaterialData } = useMaterialDataService()
    const [optionMaterials, setOptionMaterials] = useState([])
    const [locationData, setLocationData] = useState([])
    const [form, setForm] = useState({
        location_name: "",
        plant: "",
        materials: null,
        created_by: auth?.user,
        updated_by: auth?.user
    })
    const [dataQR, setDataQR] = useState({})

    const optionPlants = [
        { label: "P1 - PLANT 1", value: "P1 - PLANT 1"},
        { label: "P2 - PLANT 2", value: "P2 - PLANT 2"},
    ]
    const fetchSupplyLocation = async() => {
        try {
            const response = await getSupplyLocationAll()
            setLocationData(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchOptionMaterials = async() => {
        try {
            const response = await getMaterialData('material')
            const options = response?.data?.map((item)=>({
                label: `[${item.plant}] ${item.material_desc} [${item.material_no}]`,
                value: item.material_id
            }))
            setOptionMaterials(options)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchSupplyLocation()
        fetchOptionMaterials()
        setLoading({ ...loading, fetch: false})
    }, [])

    

    // Pagination and Table Date
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [itemPerPage, setItemPerPage] = useState(10)
    const paginatedData = locationData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    
    useEffect(()=>{
        setTotalPage(Math.ceil(locationData.length / itemPerPage))
    }, [locationData, itemPerPage])


    // print/download QR code
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

            pdf.save(`QR_Supply_${data.location_name}_${data.plant}.pdf`);
        }
    };

    const handleOpenModal = (type, data) => {
        if(type==='update'){
            const assigned = data.materials.map((item)=>({
                material_id: item.material_id
            }))
            console.log("assigned: ", assigned)
            setForm({
                ...form,
                old_location_name: data.location_name,
                location_name: data.location_name,
                plant: data.plant,
                materials: assigned,
                old_materials: assigned
            })
        }else if(type==='delete'){
            setForm({
                ...form,
                id: data.id
            })
        }else{
            setForm({
                ...form,
                location_name: "",
                plant: "",
                materials: null
            })
        }
        setShowModal({ ...setShowModal, [type]: true, type: type})
    }

    const handleCloseModal = () => {
        setShowModal({
            ...showModal,
            add: false,
            update: false,
            delete: false
        })
    }

    const handleOpenModalQR = (data) => {
        setDataQR({
            location_name: data.location_name,
            plant: data.plant
        })
        setShowModalQR(true)
    }

    const handleChangeSelectMaterials = (selected) => {
        let array = []
        selected.map((item)=>array.push({ material_id: item.value}))
        setForm({ 
            ...form, 
            materials: array
        })
    }

    const handleSubmit = async() => {
        try {
            setLoading({ ...loading, submit: true})
            const response = showModal.type === "add" ? await createSupplyLocation(form) : await updateSupplyLocation(form)
            console.log("response submit: ", response)
            if(response){
                if(response.status !== 200 && response.status !== 201 && response.status !== 204){
                    addToast(response.message, 'danger', 'error')
                }else{
                    addToast(response.data.message, 'success', 'success')
                    fetchSupplyLocation()
                    setShowModal(false)
                }
            }
        } catch (error) {
            console.error(error)
        } finally{
            setLoading({ ...loading, submit: false})
        }
    }

    const handleDelete = async() => {
        try {
            setLoading({ ...loading, submit: true})
            const response = await deleteSupplyLocationByName(form.id)
            addToast(response?.data?.message, 'success', 'success')
            await fetchSupplyLocation()
            handleCloseModal('delete')
        } catch (error) {
            console.error(error)
        } finally{
            setLoading({ ...loading, submit: false})
        }
    }


    const renderModal = (type) => {
        if(type==='add' || type==='update'){
            return(
                <CModal
                    visible={showModal.add || showModal.update}
                    backdrop="static"
                    onClose={handleCloseModal}
                >
                    <CModalHeader>
                        <CModalTitle>{type==="add" ? "Add" : "Update"} Supply Location</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol>
                                <CFormLabel>Location Name</CFormLabel>
                                <CFormInput
                                    placeholder='Supply location name'
                                    value={form.location_name}
                                    onChange={(e)=>setForm({ ...form, location_name: e.target.value})}
                                    isClearable
                                />
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol>
                                <CFormLabel>Plant</CFormLabel>
                                <Select
                                    isDisabled={type==='update'}
                                    options={optionPlants}
                                    value={optionPlants.find((opt)=>opt.value === form.plant)}
                                    onChange={(e)=>setForm({ ...form, plant: e!== null ? e.value : ""})}
                                />
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol>
                                <CFormLabel>Materials</CFormLabel>
                                <Select
                                    options={optionMaterials}
                                    isClearable
                                    isMulti
                                    onChange={handleChangeSelectMaterials}
                                    value={optionMaterials?.filter(opt=>
                                        form?.materials?.some(material=> material?.material_id === opt?.value)
                                    )}
                                />
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <div className='d-flex gap-3'>
                            <CButton className='btn-secondary text-white' onClick={handleCloseModal}>Cancel</CButton>
                            <CButton className='btn-success text-white' disabled={loading.submit} onClick={handleSubmit}>
                                { loading.submit && <CSpinner size='sm' className='me-2'/> } {type==="add" ? "Add" : "Update"}
                            </CButton>
                        </div>
                    </CModalFooter>
                </CModal>
            )
        }else if(type==='delete'){
            return(
                <CModal
                    visible={showModal.delete}
                >
                    <CModalHeader>
                        <CModalTitle>Delete Supply Location</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        Are you sure want to delete location named &quot;{form.location_name}&quot;
                    </CModalBody>
                    <CModalFooter>
                        <div className='d-flex gap-3'>
                            <CButton className='btn-secondary text-white' onClick={handleCloseModal}>Cancel</CButton>
                            <CButton className='btn-success text-white' disabled={loading.submit} onClick={handleDelete}>
                                { loading.submit && <CSpinner size='sm' className='me-2'/> } Delete
                            </CButton>
                        </div>
                    </CModalFooter>
                </CModal>
            )
        }
    }

    const renderModalQR = () => {
            return(
                <CModal
                    visible={showModalQR}
                    onClose={() => setShowModalQR(false)}
                    aria-labelledby="QRSupplyLocation"
                    >
                    <CModalHeader>
                        <CModalTitle id="QRSupplyLocation">QR Code Supply Location</CModalTitle>
                    </CModalHeader>
                    <CModalBody id="qr-content">
                        <CRow>
                            <h3 className='text-center pt-2'>{dataQR.location_name}</h3>
                            <h4 className='text-center pb-2'>{dataQR.plant}</h4>
                        </CRow>
                        <CRow>
                            <QRCode
                                title={`QR Code for ${dataQR.location_name} in ${dataQR.plant}`}
                                // value={`${dataQR.material_no}, ${dataQR.material_desc}, ${dataQR.plant}, ${dataQR.uom}, ${dataQR.pack}, ${dataQR.qty_pack}, ${dataQR.qty_uom}`}
                                value={`${dataQR.location_name}/${dataQR.plant}`}
                                bgColor="white"
                                fgColor="black"
                                size={300}
                            />
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" className='btn-close-red' onClick={() => setShowModalQR(false)}>
                        Close
                        </CButton>
                        <CButton className='btn-add-master' onClick={()=>handlePrint(dataQR)}>Print</CButton>
                    </CModalFooter>
                </CModal>
            )
        }

  return (
    <>
        <CContainer fluid >
            {/* Toast */}
            {/* <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} /> */}
            { renderModal(showModal.type) }
            { renderModalQR() }
            <CRow>
                <CCol>
                    <CButton className='btn-success text-white' onClick={()=>handleOpenModal('add', form)}>Add Location</CButton>
                </CCol>
            </CRow>

            <CRow>
                <CCol className='py-4 text-table-small'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                { (auth.userData.role_name === "LANE HEAD" || auth.userData.role_name === "SUPER ADMIN") && <CTableHeaderCell colSpan={2}>Action</CTableHeaderCell>}
                                <CTableHeaderCell>No</CTableHeaderCell>
                                <CTableHeaderCell>Supply Location Name</CTableHeaderCell>
                                <CTableHeaderCell>Plant</CTableHeaderCell>
                                <CTableHeaderCell>Material No</CTableHeaderCell>
                                <CTableHeaderCell>Material Desc</CTableHeaderCell>
                                <CTableHeaderCell>QR Code</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {(paginatedData.length > 0 && !loading.fetch) && paginatedData?.map((item, index)=>{
                                return(
                                    <CTableRow key={index}>
                                        { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") &&
                                            <CTableDataCell className='text-center'>
                                                <CButton onClick={()=>handleOpenModal('update', item)} className='btn-icon-edit' ><CIcon icon={icon.cilColorBorder}/></CButton>
                                            </CTableDataCell>
                                        }
                                        { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") &&
                                            <CTableDataCell className='text-center' >
                                                <CButton onClick={()=>handleOpenModal('delete', item)} className='btn-icon-delete'><CIcon icon={icon.cilTrash}/></CButton>
                                            </CTableDataCell>
                                        }
                                        <CTableDataCell>{index+1}</CTableDataCell>
                                        <CTableDataCell>{item?.location_name}</CTableDataCell>
                                        <CTableDataCell>{item?.plant}</CTableDataCell>
                                        <CTableDataCell>{item?.materials?.map((material, index)=>{
                                                return (
                                                <div key={index}>{material.material_no}</div>
                                            )})}
                                        </CTableDataCell>
                                        <CTableDataCell>{item?.materials?.map((material, index)=>{
                                                return(
                                                    <div key={index}>{material.material_desc}</div>
                                                )
                                            })}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {/* <CButton onClick={()=>navigate(`/supplier-location/${item.location_name}/${item.plant}`)} color='info' className='h-100 justify-content-center d-flex align-items-center'><CIcon size='sm' className='text-white' icon={icon.cilQrCode}/></CButton> */}
                                            <CButton onClick={()=>handleOpenModalQR(item)} color='info' className='h-100 justify-content-center d-flex align-items-center'><CIcon size='sm' className='text-white' icon={icon.cilQrCode}/></CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                )
                            })}
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
                        data={locationData}
                    />
                </CCol>
            </CRow>
        </CContainer>
    </>
  )
}

export default SupplyLocation