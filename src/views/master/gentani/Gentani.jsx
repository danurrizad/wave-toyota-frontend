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
    CModalBody,
    CModalFooter,
    CModalTitle,
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

import useGentaniDataService from './../../../services/GentaniDataService';
import useMaterialDataService from './../../../services/MaterialDataService';
import { useAuth } from '../../../utils/context/authContext';

const Gentani = () => {
    const {getGentaniData, createGentaniData, createGentaniDataByUpload, updateGentaniData, deleteGentaniData} = useGentaniDataService()
    const {getMaterialData} = useMaterialDataService()
    const [ gentaniData, setGentaniData ] = useState([])
    const [ materialData, setMaterialData ] = useState([])
    const [ filteredData, setFilteredData ] = useState([])

    const auth = useAuth()

    const [visibleModalAdd, setVisibleModalAdd] = useState(false)
    const [visibleModalUpload, setVisibleModalUpload] = useState(false)
    const [visibleModalUpdate, setVisibleModalUpdate] = useState(false)
    const [visibleModalDelete, setVisibleModalDelete] = useState(false)

    const [formData, setFormData] = useState({
        katashiki: "",
        material_no: "Select",
        material_desc: "",
        plant: "",
        plant2: "",
        quantity: "",
        created_by: auth.user,
        updated_by: ""
    })

    const [file, setFile] = useState(null)

    const handleChangeUpload = (e) => {
        setFile(e.target.files[0])
    }

    const [formUpdateData, setFormUpdateData] = useState({
        katashiki: "",
        material_no: "Select",
        material_desc: "",
        plant: "",
        quantity: "",
        updated_by: auth.user
    })

    const [formDeleteData, setFormDeleteData] = useState({
        gentani_id: 0,
        katashiki: "",
        material_no: ""
    })

    const handleModalUpdate = (data) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            katashiki: data.katashiki,
            material_no: data.material_no,
            material_desc: data.material_desc,
            plant: data.plant,
            quantity: data.quantity,
            updated_by: auth.user
        })
    }

    const handleModalDelete = (data) => {
        setVisibleModalDelete(true)
        setFormDeleteData({
            gentani_id: data.gentani_id,
            katashiki: data.katashiki,
            material_no: data.material_no
        })
    }

    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalGentaniData, setTotalGentaniData] = useState(0)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        katashiki: "",
        materialDescOrNo: "",
        plant: "All"
    });

    const handleSearch = () => {
        const { katashiki, materialDescOrNo, plant } = searchQuery

        const filtered = gentaniData.filter( gentani => {
            const matchesKatashiki = gentani.katashiki.toLowerCase().includes(katashiki.toLowerCase())
            const matchesDescOrNo = gentani.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase()) || gentani.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase())
            // const matchesNo = gentani.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase())
            const matchesPlant = plant === "All" || gentani.plant.toLowerCase().includes(plant.toLowerCase())
            return matchesKatashiki && matchesDescOrNo && matchesPlant
        })
        
        setFilteredData(filtered)
        setTotalPage(Math.ceil(filtered.length / itemPerPage))
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchQuery({ katashiki: "", materialDescOrNo: "", plant: "All"})
        setFilteredData(gentaniData)
        setTotalPage(Math.ceil(gentaniData.length / itemPerPage))
        setCurrentPage(1)
    }

    const handleSetItemPerPage = (item) => {
        setItemPerPage(item)
        setCurrentPage(1)
    }


    useEffect(()=>{
        setTotalPage(Math.ceil(filteredData.length / itemPerPage))
    }, [filteredData, itemPerPage])

    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    

    
    
    const mergeMaterials = (data) => {
        const grouped = {};
      
        Object.values(data).forEach((material) => {
          const { material_no, plant } = material;
      
          if (!grouped[material_no]) {
            grouped[material_no] = { ...material }; // Initialize with the first material data
          } else {
            // Add subsequent plants as new properties (e.g., plantSecond, plantThird, etc.)
            const plantKeys = Object.keys(grouped[material_no]).filter((key) =>
              key.startsWith("plant")
            );
            const nextPlantKey = `plant${plantKeys.length + 1}`;
            grouped[material_no][nextPlantKey] = plant;
          }
        });
      
        // Convert the grouped object into an array
        return Object.values(grouped);
      };

    const getMaterial = async() => {
        try {
            setLoading(true)
            const response = await getMaterialData('material')
            const groupedMaterial = mergeMaterials(response.data)

            setMaterialData(groupedMaterial)
            // setMaterialData(response.data)
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

    const getGentani = async() => {
        try {
            setLoading(true)
            const response = await getGentaniData('gentani')

            setGentaniData(response.data)
            setFilteredData(response.data)
            setTotalGentaniData(response.data.length)
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

    useEffect(() => {
        getGentani()
        getMaterial()
    }, [])

    const handleCreateGentani = async (form) => {
        try {
          setLoading(true)
          const response = await createGentaniData("gentani", form);
        //   const responseSet = await setGentaniInMaterialData("gentani-material", response.data.data.gentani_id, materialNumber)
          addToast(templateToast("Success", response.data.message));
          
          setFormData((prev)=>({...prev, plant: "Select", plant2: "", material_no: "Select", material_desc: ""}))
          setVisibleModalAdd(false)
          getGentani()
      
        } catch (error) {

          // If the error comes from Axios, check the error response
          if (error.response) {
            console.error("Error Response: ", error.response);
            addToast(templateToast("Error", error.response.data.message));
          } 
          else {
            // Fallback for unexpected errors
            console.error("Unexpected Error: ", error);
            addToast(templateToast("Error", "An unexpected error occurred."));
          }
        } finally{
            setLoading(false)
        }
    };

    const handleCreateByUpload = async () => {
        if (!file) {
            addToast(templateToast("Error", "Please provide a file!"));
            return;
        }
    
        const fileName = file.name;
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                // Read the file data and convert it to a workbook
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
    
                // Convert the first worksheet to JSON
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
                // Prepare the body for the request
                const bodyFile = {
                    file_name: fileName,
                    data: jsonData,
                    created_by: auth.user,
                };
    
                console.log("Body file prepared for upload:", bodyFile);
    
                // Example API call (ensure `createGentaniDataByUpload` is properly defined)
                const response = await createGentaniDataByUpload('/gentani/upload', bodyFile);
                console.log(response)
                // Handle successful response
                // console.log("Response from API:", response);
                addToast(templateToast("Success", response.data.message));
                if(response.data.errors.length !== 0){
                    addToast(templateToast("Failed", `${response.data.errors.length} Gentani failed to create!`))
                }
                setVisibleModalUpdate(false)
                getGentani()
            } catch (error) {
                console.error("Error processing file:", error);
    
                // Handle errors
                const errorMessage = error.response?.data?.message || error.message;
                addToast(templateToast("Error", errorMessage));
            }
        };
    
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    };

    const handleUpdateGentani = async(gentaniId, qty) => {
        try {
            setLoading(true)
            const body = {
                quantity: qty,
                updated_by: auth.user
            }
            const response = await updateGentaniData("gentani", gentaniId, body)

            addToast(templateToast("Success", response.data.message))
            getGentani()
            setVisibleModalUpdate((prev)=>({...prev, state: false}))
            
        } catch (error) {
            // If the error comes from Axios, check the error response
          if (error.response) {
            console.error("Error Response: ", error.response);
            addToast(templateToast("Error", error.response.data.message));
          } 
          else {
            // Fallback for unexpected errors
            console.error("Unexpected Error: ", error);
            addToast(templateToast("Error", "An unexpected error occurred."));
          }
        } finally{
            setLoading(false)
        }
    }

    const handleDeleteGentani = async(gentaniId) => {
        try {
            setLoading(true)

            const responseDel = await deleteGentaniData("gentani", gentaniId)
            addToast(templateToast("Success", responseDel.data.message))

            setVisibleModalDelete(false)
            getGentani()

        } catch (error) {
            // If the error comes from Axios, check the error response
            if (error.response) {
                console.error("Error Response: ", error.response);
                addToast(templateToast("Error", error.response.data.message));
            } 
            else {
                // Fallback for unexpected errors
                console.error("Unexpected Error: ", error);
                addToast(templateToast("Error", "An unexpected error occurred."));
            }
        } finally{
            setLoading(false)
        }
    }
      



    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const templateToast = (type, msg) => {
        return(
            <CToast autohide={true} key={Date.now()}>
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

    const handleDownload = (data) => {
        const table = Object.keys(data).map((key) => ({
            no: Number(key)+1,
            katashiki: data[key].katashiki,
            material_no: data[key].material_no,
            material_desc: data[key].material_desc,
            plant: data[key].plant,
            quantity: data[key].quantity,
            uom: data[key].uom,
            created_by: data[key].created_by,
            createdAt: dayjs(data[key].createdAt).format('YYYY-MM-DD HH:mm:ss'),
            updated_by: data[key].updated_by,
            updatedAt: dayjs(data[key].updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        }));
        
        // 2. Convert the filtered data into a worksheet
        const worksheet = XLSX.utils.json_to_sheet(table);
        
        // 3. Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredTable");
        
        // 4. Generate a binary string representation of the workbook
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        
        // 5. Create a Blob and save the file
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `Gentani Table.xlsx`);
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

            {/* Start of Modal Add */}
            <CModal
                backdrop="static"
                visible={visibleModalAdd}
                onClose={() => setVisibleModalAdd(false)}
                aria-labelledby="AddGentaniData"
                >
                <CModalHeader>
                    <CModalTitle id="AddGentaniData">Insert Gentani Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="katashiki" className="col-sm-4 col-form-label">Katashiki<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="katashiki" onChange={(e)=>setFormData((prev)=>({...prev, katashiki: e.target.value}))}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Material No<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown variant="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formData.material_no} {formData.material_no != "Select" && "-"} {formData.material_desc}</CDropdownToggle>
                                <CDropdownMenu>
                                    {materialData && materialData.map((material, index)=>{
                                        return(
                                            <CDropdownItem 
                                                key={index}  
                                                onClick={()=>setFormData((prev)=>({...prev, material_no: material.material_no, material_desc: material.material_desc, plant: material.plant, plant2: material.plant2 ? material.plant2 : ""}))}
                                                className='cursor-pointer dropdown-item'
                                                >
                                                    {material.material_no} - {material.material_desc}
                                            </CDropdownItem>
                                        )
                                    })}
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Plant<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown variant="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled={formData.material_no === "Select"} className='d-flex justify-content-between align-items-center dropdown-search'>{formData.plant !="" ? formData.plant : "Select"}</CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem className='cursor-pointer' onClick={()=>setFormData({...formData, plant: "P1 - PLANT 1"})}>P1 - PLANT 1</CDropdownItem>
                                    {formData.plant2 !== "" && <CDropdownItem className='cursor-pointer' onClick={()=>setFormData({...formData, plant: "P2 - PLANT 2"})}>P2 - PLANT 2</CDropdownItem>}
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantitiy" className="col-sm-4 col-form-label">Quantity<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="quantity" onChange={(e)=>setFormData((prev)=>({...prev, quantity: e.target.value}))}/>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalAdd(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleCreateGentani(formData)}>Add data</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Add */}

            {/* Start of Modal Update */}
            <CModal
                backdrop="static"
                visible={visibleModalUpdate}
                onClose={() => setVisibleModalUpdate(false)}
                aria-labelledby="UpdateGentaniData"
                >
                <CModalHeader>
                    <CModalTitle id="UpdateGentaniData">Update Gentani Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Katashiki</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialNo" disabled value={formUpdateData?.katashiki }/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Material No</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.material_no}</CDropdownToggle>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Plant</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.plant}</CDropdownToggle>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantitiy" className="col-sm-4 col-form-label">Quantity</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="quantity" 
                                value={formUpdateData.quantity}  
                                onChange={(e) => formUpdateData((prev) => ({
                                    ...prev, 
                                    quantity: e.target.value
                                }))}/>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=> handleUpdateGentani(visibleModalUpdate.data.gentani_id, visibleModalUpdate.data.quantity)}>Update data</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}
            
             {/* Start of Modal Delete */}
             <CModal
                backdrop="static"
                visible={visibleModalDelete}
                onClose={() => setVisibleModalDelete(false)}
                aria-labelledby="DeleteMaterialData"
                >
                <CModalHeader>
                    <CModalTitle id="DeleteMaterialData">Delete Gentani Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol>
                            <p>Are you sure want to delete this Gentani with 
                                <span style={{fontWeight: "bold"}}> Katashiki : {formDeleteData.katashiki} </span>
                                 and 
                                <span style={{fontWeight: "bold"}}> Material No : {formDeleteData.material_no} </span>
                            </p>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalDelete(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleDeleteGentani(formDeleteData.gentani_id)}>Delete</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Delete */}

            {/* Start of Modal Upload */}
            <CModal
                backdrop="static"
                visible={visibleModalUpload}
                onClose={() => setVisibleModalUpload(false)}
                aria-labelledby="UploadGentaniData"
                >
                <CModalHeader>
                    <CModalTitle id="UploadGentaniData">Upload Gentani Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantitiy" className="col-sm-4 col-form-label">File (.xlsx)<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="file" accept='.xlsx' id="upload" onChange={(e)=>handleChangeUpload(e)}/>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpload(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleCreateByUpload()}>Upload data</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Upload */}

            <CRow>
                <CCol xs={12} xl={4}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="materialDesc" className='col-sm-4 col-xl-2 col-form-label'>Katashiki</CFormLabel>
                        <CCol className="d-flex align-items-center justify-content-start gap-2 col-xl-7" >
                            <CFormInput type="text" id="materialDesc" value={searchQuery.katashiki} onChange={(e) => setSearchQuery((prev)=>({...prev, katashiki: e.target.value}))}/> 
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xl={4}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="supplyLine" className="col-sm-4 col-form-label">Material No/Desc</CFormLabel>
                        <CCol className='d-flex align-items-center justify-content-start gap-2 col-xl-7'>
                            <CFormInput type="text" id="supplyLine" value={searchQuery.materialDescOrNo} onChange={(e)=>setSearchQuery((prev)=>({ ...prev, materialDescOrNo: e.target.value}))}/>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xl={4}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-sm-4 col-xl-2 col-form-label' >Plant</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-6 col-xl-8'>
                            <CDropdown className='dropdown-search d-flex justify-content-between'>
                                <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                        <CDropdownItem onClick={() => setSearchQuery((prev)=>({...prev, plant: "All"}))}>All</CDropdownItem>
                                        <CDropdownItem onClick={() => setSearchQuery((prev)=>({...prev, plant: "P1 - Plant 1"}))}>P1 - Plant 1</CDropdownItem>
                                        <CDropdownItem onClick={() => setSearchQuery((prev)=>({...prev, plant: "P2 - Plant 2"}))}>P2 - Plant 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol className="d-flex justify-content-end gap-3 col-sm-2">
                            <CButton className="btn-search" onClick={()=>handleSearch()}>Search</CButton>
                            <CButton color="secondary" onClick={() => handleClearSearch()}>Clear</CButton>
                        </CCol >
                    </CRow>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} xl={4} className='mt-4'>
                    <CButton className='btn-add-master' onClick={()=>setVisibleModalAdd((prev) => ({ ...prev, state: true}))}>Add Gentani</CButton>
                    <CButton className='btn-download mx-2' onClick={()=>handleDownload(paginatedData)}>Download</CButton>
                    <CButton className='btn-upload' onClick={()=>setVisibleModalUpload(true)}>Upload</CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol className='py-4 text-table-small '>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col" colSpan={2} className='text-center'>Action</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Katashiki</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Uom</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed Date</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            { paginatedData && paginatedData.map((gentani, index) => {
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(gentani)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-delete' onClick={()=>handleModalDelete(gentani)}><CIcon icon={icon.cilTrash}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>{gentani.katashiki}</CTableDataCell>
                                        <CTableDataCell>{gentani.material_no}</CTableDataCell>
                                        <CTableDataCell>{gentani.material_desc}</CTableDataCell>
                                        <CTableDataCell>{gentani.plant}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity}</CTableDataCell>
                                        <CTableDataCell>{gentani.uom}</CTableDataCell>
                                        <CTableDataCell>{gentani.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(gentani.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{gentani.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(gentani.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                </CCol>
                    {paginatedData?.length === 0 && <h2 className='text-center py-4'>No gentani data found!</h2>}
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

export default Gentani