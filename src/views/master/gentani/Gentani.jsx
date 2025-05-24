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
    CModalBody,
    CModalFooter,
    CModalTitle,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CSpinner,
    CImage,
    CCardBody,
    CCard,
    CCardHeader,
    CToastClose,
} from '@coreui/react'

import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from 'react-select'
import ImageGuide from '/src/assets/images/master/upload-guidance.png'
import FileTemplateUpload from '/src/assets/files/template-upload-gentani.xlsx'

import useGentaniDataService from './../../../services/GentaniDataService';
import useMaterialDataService from './../../../services/MaterialDataService';
import { useAuth } from '../../../utils/context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faInfo, faQuestionCircle, faWarning, faX } from '@fortawesome/free-solid-svg-icons'

const Gentani = () => {
    const {getGentaniData, createGentaniData, createGentaniDataByUpload, updateGentaniData, deleteGentaniData, getRatioProductionData, updateRatioProductionData} = useGentaniDataService()
    const {getMaterialData} = useMaterialDataService()
    const [ gentaniData, setGentaniData ] = useState([])
    const [ materialData, setMaterialData ] = useState([])
    const [ filteredData, setFilteredData ] = useState([])
    const [ ratioProdData, setRatioProdData ] = useState([])

    const auth = useAuth()

    const [visibleModalAdd, setVisibleModalAdd] = useState(false)
    const [visibleModalRatio, setVisibleModalRatio] = useState(false)
    const [visibleModalUpload, setVisibleModalUpload] = useState(false)
    const [visibleModalUpdate, setVisibleModalUpdate] = useState(false)
    const [visibleModalDelete, setVisibleModalDelete] = useState(false)

    const [formData, setFormData] = useState({
        katashiki: "",
        material_no: "Select",
        material_desc: "",
        plant: "",
        plant2: "",
        uom: "",
        quantity_fortuner: 0,
        quantity_zenix: 0,
        quantity_innova: 0,
        quantity_avanza: 0,
        quantity_yaris: 0,
        quantity_calya: 0,
        created_by: auth.user,
        updated_by: ""
    })

    const [ formUpdateRatio, setFormUpdateRatio ] = useState({
        fortuner: 0,
        zenix: 0,
        innova: 0,
        tact_time_1: 0,
        efficiency_1: 0,
        avanza: 0,
        yaris: 0,
        calya: 0,
        tact_time_2: 0,
        efficiency_2: 0
    })

    const handleModalRatio = (data) => {
        setVisibleModalRatio(true)
        setFormUpdateRatio({
            fortuner: data.data.fortuner,
            zenix: data.data.zenix,
            innova: data.data.innova,
            tact_time_1: data.data.tact_time_1,
            efficiency_1: data.data.efficiency_1,
            avanza: data.data.avanza,
            yaris: data.data.yaris,
            calya: data.data.calya,
            tact_time_2: data.data.tact_time_2,
            efficiency_2: data.data.efficiency_2,
        })
    }

    const [file, setFile] = useState(null)

    const handleChangeUpload = (e) => {
        setFile(e.target.files[0])
    }

    const [formUpdateData, setFormUpdateData] = useState({
        gentani_id: null,
        katashiki: "",
        material_no: "Select",
        material_desc: "",
        plant: "",
        uom: "",
        quantity_fortuner: 0,
        quantity_zenix: 0,
        quantity_innova: 0,
        quantity_avanza: 0,
        quantity_yaris: 0,
        quantity_calya: 0,
        updated_by: auth.user
    })

    const [formDeleteData, setFormDeleteData] = useState({
        gentani_id: null,
        // katashiki: "",
        material_no: "",
        plant: ""
    })

    const handleModalUpdate = (data) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            gentani_id: data.gentani_id,
            katashiki: data.katashiki,
            material_no: data.material_no,
            material_desc: data.material_desc,
            plant: data.plant,
            uom: data.uom,
            quantity_fortuner: data.quantity_fortuner,
            quantity_zenix: data.quantity_zenix,
            quantity_innova: data.quantity_innova,
            quantity_avanza: data.quantity_avanza,
            quantity_yaris: data.quantity_yaris,
            quantity_calya: data.quantity_calya,
            updated_by: auth.user
        })
    }

    const handleModalDelete = (data) => {
        setVisibleModalDelete(true)
        setFormDeleteData({
            gentani_id: data.gentani_id,
            // katashiki: data.katashiki,
            material_no: data.material_no,
            plant: data.plant
        })
    }

    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)

    // Handle search functionality
    const [searchQuery, setSearchQuery] = useState({
        katashiki: "",
        materialDescOrNo: "",
        plant: "All",
        unit: "All"
    });

    const optionsMaterialDesc= materialData.map((material) => ({
        value: material.material_no,
        label: `${material.material_no} - ${material.material_desc}`,
        plant: material.plant,
        plant2: material.plant2 ? material.plant2 : "",
    }));
    
    // STYLING FOR SELECT
    const colorStyles = {
        control: (styles, { isFocused }) => ({
            ...styles,
            borderColor: isFocused ? 'black' : styles.borderColor, // Change border color when focused
            boxShadow: isFocused ? '0 0 0 0.5px black' : styles.boxShadow, // Add blue outline
            '&:hover': {
                borderColor: isFocused ? 'black' : styles.borderColor, // Keeps focus border on hover
            },
            }),
        option: (styles, { isFocused, isSelected, isDisabled  }) => ({
            ...styles,
            backgroundColor: isSelected
            ? '#808080' // Background color when the option is selected
            : isFocused
            ? '#F3F4F7' // Background color when the option is focused
            :  undefined, // Default background color
            ':active': {
                backgroundColor: !isDisabled
                ? isSelected
                    ? '#808080' // Background when selected and active
                    : '#F3F4F7' // Background when focused and active
                : undefined,
            },
        }),
    };

    const handleSearch = () => {
        const { katashiki, materialDescOrNo, plant, unit } = searchQuery

        const filtered = gentaniData.filter( gentani => {
            // const matchesKatashiki = !katashiki || gentani.katashiki.toLowerCase() === katashiki.toLowerCase()
            const matchesDescOrNo = gentani.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase()) || gentani.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase())
            const matchesPlant = plant === "All" || gentani.plant.toLowerCase().includes(plant.toLowerCase())
            // Dynamically access the property based on `unit`
            const matchesUnit = unit === "All" || (gentani[`quantity_${unit.toLowerCase()}`] !== undefined && gentani[`quantity_${unit.toLowerCase()}`] !== null &&  gentani[`quantity_${unit.toLowerCase()}`] !== 0);

            return matchesDescOrNo && matchesPlant && matchesUnit
        })
        
        setFilteredData(filtered)
        setTotalPage(Math.ceil(filtered.length / itemPerPage))
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchQuery({ katashiki: "", materialDescOrNo: "", plant: "All", unit: "All"})
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
            // setTotalGentaniData(response.data.length)
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

    const getRatioProduction = async() => {
        try {
            setLoading(true)
            const response = await getRatioProductionData('ratio-production')
            setRatioProdData(response.data)
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
        getRatioProduction()
    }, [])

    const handleCreateGentani = async (form) => {
        try {
          setLoading(true)
          const response = await createGentaniData("gentani", form);
          addToast(templateToast("success", response.data.message));
          
          setFormData((prev)=>({
            ...prev, 
            plant: "Select", 
            plant2: "", 
            uom: "", 
            material_no: "Select", 
            material_desc: "", 
            quantity_fortuner: 0,
            quantity_zenix: 0,
            quantity_innova: 0,
        }))
          setVisibleModalAdd(false)
          getGentani()
      
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
                setLoading(true)
                // Read the file data and convert it to a workbook
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
    
                // Convert the first worksheet to JSON
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    
                // Prepare the body for the request
                const bodyFile = {
                    file_name: fileName,
                    data: jsonData,
                    created_by: auth.user,
                };
                const response = await createGentaniDataByUpload('/gentani/upload', bodyFile);
                addToastErr(templateToastMultipleMsg(response))
                setVisibleModalUpload(false)
            } catch (error) {
                // Handle errors
                const errorMessage = error.response?.data?.message || error.message;
                addToast(templateToast("Error", errorMessage));
            } finally{
                setLoading()
                getGentani()
            }

        };
    
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    };

    const handleUpdateGentani = async(gentaniId, qty_fortuner, qty_zenix, qty_innova, qty_avanza, qty_yaris, qty_calya) => {
        try {
            setLoading(true)
            const body = {
                quantity_fortuner: qty_fortuner,
                quantity_zenix: qty_zenix,
                quantity_innova: qty_innova,
                quantity_avanza: qty_avanza,
                quantity_yaris: qty_yaris,
                quantity_calya: qty_calya,
                updated_by: auth.user
            }
            const response = await updateGentaniData("gentani", gentaniId, body)

            addToast(templateToast("success", response.data.message))
            setVisibleModalUpdate(false)
            
        } catch (error) {
          if (error.response) {
            addToast(templateToast("Error", error.response.data.message));
          } 
          else {
            addToast(templateToast("Error", "An unexpected error occurred."));
          }
        } finally{
            setLoading(false)
            getGentani()
        }
    }

    const handleDeleteGentani = async(gentaniId) => {
        try {
            setLoading(true)

            const responseDel = await deleteGentaniData("gentani", gentaniId)
            addToast(templateToast("success", responseDel.data.message))

            setVisibleModalDelete(false)
            getGentani()

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
      
    const handleUpdateRatio = async(body) =>{
        try {
            setLoading(true)
            if(body.fortuner > 100 || body.zenix > 100 || body.innova > 100 || body.avanza > 100 || body.yaris > 100 || body.calya > 100){
                addToast(templateToast("Error", "Rate production each unit can't be more than 100!"))
                setLoading(false)
                return
            }
            if(+body.fortuner + +body.zenix + +body.innova > 100){
                addToast(templateToast("Error", "Rate production in PLANT 1 can't be more than 100!"))
                setLoading(false)
                return
                
            }
            if(+body.avanza + +body.yaris + +body.calya > 100){
                addToast(templateToast("Error", "Rate production in PLANT 2 can't be more than 100!"))
                setLoading(false)
                return
            }

            if(body.efficiency_1 > 100 || body.efficiency_2 > 100){
                addToast(templateToast("Error", "Efficiency can't be more than 100"))
                setLoading(false)
                return
            }
            
            const response = await updateRatioProductionData('ratio-production', body, 1)
            addToast(templateToast("success", response.data.message))
            setVisibleModalRatio(false)
            getRatioProduction()
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


    const [toast, addToast] = useState(0)
    const [toastErr, addToastErr] = useState(0)
    const toaster = useRef()
    const toasterErr = useRef()
    const templateToast = (type, msg) => {
        return(
            // <CToast visible={true} autohide={true} key={Date.now()} ref={toaster}>
            //     <CToastHeader closeButton>
            //         <svg
            //         className="bg-black rounded me-2"
            //         width="20"
            //         height="20"
            //         xmlns="http://www.w3.org/2000/svg"
            //         preserveAspectRatio="xMidYMid slice"
            //         focusable="false"
            //         role="img"
            //         >
            //         <rect width="100%" height="100%" fill={`${type === 'Success' ? "#29d93e" : "#e85454"}`}></rect>
            //         </svg>
            //         <div className="fw-bold me-auto">{type}</div>
            //         {/* <small>7 min ago</small> */}
            //     </CToastHeader>
            //     <CToastBody>{msg}</CToastBody>
            // </CToast>
            <CToast
                key={Date.now()}
                autohide={true}
                color={type} // Use the computed color instead of type
                delay={5000}
                visible={true}
            >
                <CToastBody className="d-flex align-items-center justify-content-between text-white" closeButton>
                <div className="d-flex align-items-center gap-3">
                    <FontAwesomeIcon
                    icon={
                        type === 'danger' || type === 'error'
                        ? faWarning
                        : type === 'success'
                        ? faCheckCircle
                        : type === 'warning'
                        ? faWarning
                        : type === 'info'
                        ? faInfo
                        : faQuestionCircle
                    }
                    size="lg"
                    />
                    {msg}
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div style={{ borderLeft: '2px solid white', height: '20px', width: '1px' }}></div>
                    <CToastClose dark style={{ color: 'white', opacity: 1, boxShadow: 'none', fontSize: '10px' }} />
                </div>
                </CToastBody>
            </CToast>
        )
    }

    const templateToastMultipleMsg = (data) => {
        return(
           <CToaster className='position-static'>
                {data.data.created.length > 0 && (
                    <CToast
                        key={Date.now()}
                        autohide={true}
                        color={'success'} // Use the computed color instead of type
                        delay={5000}
                        visible={true}
                    >
                        <CToastBody className="d-flex align-items-center justify-content-between text-white" closeButton>
                        <div className="d-flex align-items-center gap-3">
                            <FontAwesomeIcon
                            icon={
                                type === 'danger' || type === 'error'
                                ? faWarning
                                : type === 'success'
                                ? faCheckCircle
                                : type === 'warning'
                                ? faWarning
                                : type === 'info'
                                ? faInfo
                                : faQuestionCircle
                            }
                            size="lg"
                            />
                            {data.data.message}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ borderLeft: '2px solid white', height: '20px', width: '1px' }}></div>
                            <CToastClose dark style={{ color: 'white', opacity: 1, boxShadow: 'none', fontSize: '10px' }} />
                        </div>
                        </CToastBody>
                    </CToast>
                )}
                {data.data.errors.length > 0 && (
                    // <CToast visible={true} autohide={true} key={Date.now() + 1000} ref={toasterErr} style={{ overflow: "auto", maxHeight: "75vh"}}>
                    //     <CToastHeader closeButton>
                    //         <svg
                    //         className="bg-black rounded me-2"
                    //         width="20"
                    //         height="20"
                    //         xmlns="http://www.w3.org/2000/svg"
                    //         preserveAspectRatio="xMidYMid slice"
                    //         focusable="false"
                    //         role="img"
                    //         >
                    //         <rect width="100%" height="100%" fill="#e85454"></rect>
                    //         </svg>
                    //         <div className="fw-bold me-auto">Failed</div>
                    //         {/* <small>7 min ago</small> */}
                    //     </CToastHeader>
                    //     <CToastBody style={{overflow: "auto"}}>
                    //         {data.data.errors.map((error, index)=>{
                    //             return(
                    //                 <p key={index}>{error.message}</p>
                    //             )
                    //         })}
                    //     </CToastBody>
                    // </CToast>
                    <CToast
                        key={Date.now()}
                        autohide={true}
                        color={type} // Use the computed color instead of type
                        delay={5000}
                        visible={true}
                    >
                        <CToastBody className="d-flex align-items-center justify-content-between text-white" closeButton>
                        <div className="d-flex align-items-center gap-3">
                            <FontAwesomeIcon
                            icon={
                                type === 'danger' || type === 'error'
                                ? faWarning
                                : type === 'success'
                                ? faCheckCircle
                                : type === 'warning'
                                ? faWarning
                                : type === 'info'
                                ? faInfo
                                : faQuestionCircle
                            }
                            size="lg"
                            />
                            {data.data.errors.map((error, index)=>{
                                return(
                                    <p key={index}>{error.message}</p>
                                )
                            })}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ borderLeft: '2px solid white', height: '20px', width: '1px' }}></div>
                            <CToastClose dark style={{ color: 'white', opacity: 1, boxShadow: 'none', fontSize: '10px' }} />
                        </div>
                        </CToastBody>
                    </CToast>
                )}
           </CToaster>
        )
    }

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = FileTemplateUpload;
        link.download = 'template-upload-gentani.xlsx'; // Optional custom filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = (data) => {
        const table = Object.keys(data).map((key) => ({
            no: Number(key) + 1,
            material_no: data[key].material_no,
            material_desc: data[key].material_desc,
            plant: data[key].plant,
            quantity_fortuner: data[key].quantity_fortuner,
            quantity_zenix: data[key].quantity_zenix,
            quantity_innova: data[key].quantity_innova,
            quantity_avanza: data[key].quantity_avanza,
            quantity_yaris: data[key].quantity_yaris,
            quantity_calya: data[key].quantity_calya,
            uom: data[key].uom,
            created_by: data[key].created_by,
            createdAt: dayjs(data[key].createdAt).format('YYYY-MM-DD HH:mm:ss'),
            updated_by: data[key].updated_by,
            updatedAt: dayjs(data[key].updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        }));
    
        // Convert the filtered data into a worksheet
        const worksheet = XLSX.utils.json_to_sheet(table);
    
        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredTable");
    
        // Generate a binary string representation of the workbook
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
    
        // Generate a file name dynamically
        const now = dayjs();
        const fileName = `Gentani_Export_${now.format('YYYYMMDD_HHmmss')}.xlsx`;
    
        // Create a Blob and save the file
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, fileName);
    };


  return (
    <>
        <CContainer fluid >
            {/* Toast */}
            {/* <CToaster className="position-static"> */}
                <CToaster className="p-3 position-static" placement="top-end" push={toast} ref={toaster} />
                <CToaster className="p-3 position-static" placement="top-end" push={toastErr} ref={toasterErr}/>
            {/* </CToaster> */}


            {/* Start of Modal RATIO */}
            <CModal
                scrollable
                backdrop="static"
                visible={visibleModalRatio}
                onClose={() => setVisibleModalRatio(false)}
                aria-labelledby="Ratio"
                >
                <CModalHeader>
                    <CModalTitle id="Ratio">Ratio Production</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CCard>
                        <CCardHeader>PLANT 1</CCardHeader>
                        <CCardBody>
                            <CRow className="mb-">
                                <CFormLabel className="col-form-label">Rate Production</CFormLabel>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ratioF" className="col-4 col-form-label">Fortuner</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" 
                                        inputMode='numeric' 
                                        id="ratioF" 
                                        value={formUpdateRatio.fortuner} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    fortuner: value
                                                }));
                                            }
                                        }}    
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ratioZ" className="col-4 col-form-label">Zenix</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" 
                                        inputMode='numeric' 
                                        id="ratioZ" 
                                        value={formUpdateRatio.zenix} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    zenix: value
                                                }));
                                            }
                                        }}    
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-4">
                                <CFormLabel htmlFor="ratioI" className="col-4 col-form-label">Innova</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" 
                                        inputMode='numeric' 
                                        id="ratioI" 
                                        value={formUpdateRatio.innova} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    innova: value
                                                }));
                                            }
                                        }}    
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb- mt-4">
                                <CFormLabel className="col-form-label">Additional Variables</CFormLabel>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="tact1" className="col-4 col-form-label">Tact Time</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" 
                                        inputMode='numeric' 
                                        maxLength={3}
                                        max={999} 
                                        id="tact1" 
                                        value={formUpdateRatio.tact_time_1}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    tact_time_1: value
                                                }));
                                            }
                                        }}
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>seconds</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="eff1" className="col-4 col-form-label">Efficiency</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" inputMode='numeric' id="eff1" value={formUpdateRatio.efficiency_1} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 4) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    efficiency_1: value
                                                }));
                                            }
                                        }}    
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>

                        </CCardBody>
                    </CCard>
                    <CCard className='mt-3'>
                        <CCardHeader>PLANT 2</CCardHeader>
                        <CCardBody>
                            <CRow className="mb-3">
                                <CFormLabel className="col-form-label">Rate Production</CFormLabel>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ratioF" className="col-4 col-form-label">Avanza</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" inputMode='numeric' id="ratioF" value={formUpdateRatio.avanza} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    avanza: value
                                                }));
                                            }
                                        }}   
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ratioZ" className="col-4 col-form-label">Yaris</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" inputMode='numeric' id="ratioZ" value={formUpdateRatio.yaris} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    yaris: value
                                                }));
                                            }
                                        }}       
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="ratioI" className="col-4 col-form-label">Calya</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" inputMode='numeric' id="ratioI" value={formUpdateRatio.calya} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    calya: value
                                                }));
                                            }
                                        }}       
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb- mt-4">
                                <CFormLabel className="col-form-label">Additional Variables</CFormLabel>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="tact1" className="col-4 col-form-label">Tact Time</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" 
                                        inputMode='numeric' 
                                        maxLength={3}
                                        max={999} 
                                        id="tact1" 
                                        value={formUpdateRatio.tact_time_2}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 3) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    tact_time_2: value
                                                }));
                                            }
                                        }}
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>seconds</p>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="eff1" className="col-4 col-form-label">Efficiency</CFormLabel>
                                <CCol xs={3} sm={3}>
                                    <CFormInput 
                                        type="number" inputMode='numeric' id="eff1" value={formUpdateRatio.efficiency_2} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 4) { // Enforce maxLength
                                                setFormUpdateRatio((prev) => ({
                                                    ...prev,
                                                    efficiency_2: value
                                                }));
                                            }
                                        }}    
                                    />
                                </CCol>
                                <CCol xs={3} sm={2} className='d-flex align-items-center'>
                                    <p>%</p>
                                </CCol>
                            </CRow>

                        </CCardBody>
                    </CCard>
                   
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalRatio(false)}>
                    Close
                    </CButton>
                    <CButton className='d-flex btn-add-master align-items-center gap-2' disabled={loading} onClick={()=>handleUpdateRatio(formUpdateRatio)}>
                        { loading && <CSpinner size="sm"/>}
                        Save changes</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal RATIO */}

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
                    {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="katashiki" className="col-form-label col-sm-4">Katashiki<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="katashiki" onChange={(e)=>setFormData((prev)=>({...prev, katashiki: e.target.value}))}/>
                        </CCol>
                    </CRow> */}
                    <CRow className='mb-3'>
                        <CFormLabel className="col-form-label col-sm-4">Material No<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <Select 
                                noOptionsMessage={() =>  "No material found" }
                                options={optionsMaterialDesc} 
                                placeholder="Select" 
                                // isClearable 
                                value={optionsMaterialDesc.find((option) => option.value === formData.material_no) || null} 
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    material_no: e ? e.value : "",
                                    material_desc: e ? e.label.split(" - ")[1] : "",
                                    plant: e ? e.plant : "", 
                                    plant2: e.plant2 ? e.plant2 : "", 
                                })} 
                                className='w-100' 
                                styles={colorStyles}
                            />

                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-form-label col-sm-4">Plant<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled={formData.material_no === "Select"} className='d-flex dropdown-search align-items-center justify-content-between'>{formData.plant !="" ? formData.plant : "Select"}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormData({...formData, plant: "P1 - PLANT 1"})}>P1 - PLANT 1</CDropdownItem>
                                    {formData.plant2 !== "" && <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormData({...formData, plant: "P2 - PLANT 2"})}>P2 - PLANT 2</CDropdownItem>}
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-form-label">Consumption Quantity</CFormLabel>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantityF" className="col-form-label col-sm-4">{formData.plant === "P1 - PLANT 1" ? "Fortuner" : "Avanza"}<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            {formData.plant === "P1 - PLANT 1" ? 
                                <CFormInput type="number" id="quantityF" onChange={(e)=>setFormData((prev)=>({...prev, quantity_fortuner: e.target.value}))}/>
                                    :
                                <CFormInput type="number" id="quantityA" onChange={(e)=>setFormData((prev)=>({...prev, quantity_avanza: e.target.value}))}/>
                            }
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantityZ" className="col-form-label col-sm-4">{formData.plant === "P1 - PLANT 1" ? "Zenix" : "Yaris"}<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            {formData.plant === "P1 - PLANT 1" ? 
                                <CFormInput type="number" id="quantityZ" onChange={(e)=>setFormData((prev)=>({...prev, quantity_zenix: e.target.value}))}/>
                                    :
                                <CFormInput type="number" id="quantityY" onChange={(e)=>setFormData((prev)=>({...prev, quantity_yaris: e.target.value}))}/>
                            }
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantityI" className="col-form-label col-sm-4">{formData.plant === "P1 - PLANT 1" ? "Innova" : "Calya"}<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            {formData.plant === "P1 - PLANT 1" ? 
                                <CFormInput type="number" id="quantityI" onChange={(e)=>setFormData((prev)=>({...prev, quantity_innova: e.target.value}))}/>
                                    :
                                <CFormInput type="number" id="quantityC" onChange={(e)=>setFormData((prev)=>({...prev, quantity_calya: e.target.value}))}/>
                            }
                        </CCol>
                    </CRow>
                
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalAdd(false)}>
                    Close
                    </CButton>
                    <CButton className='d-flex btn-add-master align-items-center gap-2' disabled={loading} onClick={()=>handleCreateGentani(formData)}>
                        { loading && <CSpinner size="sm"/> }
                        Add data
                    </CButton>
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
                    {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="materialNo" className="col-form-label col-sm-4">Katashiki</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialNo" disabled value={formUpdateData?.katashiki }/>
                        </CCol>
                    </CRow> */}
                    <CRow className='mb-3'>
                        <CFormLabel className="col-form-label col-sm-4">Material No</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex dropdown-search align-items-center justify-content-between'>{formUpdateData.material_no}</CDropdownToggle>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-form-label col-sm-4">Plant</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} disabled className='d-flex dropdown-search align-items-center justify-content-between'>{formUpdateData.plant}</CDropdownToggle>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-form-label">Consumption Quantity ({formUpdateData.uom})</CFormLabel>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantityFA" className="col-form-label col-sm-4">{formUpdateData.plant === "P1 - PLANT 1" ? "Fortuner" : "Avanza"}</CFormLabel>
                        <CCol sm={8}>
                            {formUpdateData.plant === "P1 - PLANT 1" ? 
                                (
                                    <CFormInput type="number" inputMode='numeric' id="quantityF" 
                                        value={formUpdateData.quantity_fortuner}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_fortuner: e.target.value
                                        }))}/>
                                ) : (
                                    <CFormInput type="number" inputMode='numeric' id="quantityA" 
                                        value={formUpdateData.quantity_avanza}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_avanza: e.target.value
                                        }))}/>
                                )}
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                    <CFormLabel htmlFor="quantityZY" className="col-form-label col-sm-4">{formUpdateData.plant === "P1 - PLANT 1" ? "Zenix" : "Yaris"}</CFormLabel>
                        <CCol sm={8}>
                            {formUpdateData.plant === "P1 - PLANT 1" ? 
                                (
                                    <CFormInput type="number" inputMode='numeric' id="quantityZ" 
                                        value={formUpdateData.quantity_zenix}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_zenix: e.target.value
                                        }))}/>
                                ) : (
                                    <CFormInput type="number" inputMode='numeric' id="quantityY" 
                                        value={formUpdateData.quantity_yaris}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_yaris: e.target.value
                                        }))}/>
                                )}
                            
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                    <CFormLabel htmlFor="quantityIC" className="col-form-label col-sm-4">{formUpdateData.plant === "P1 - PLANT 1" ? "Innova" : "Calya"}</CFormLabel>
                        <CCol sm={8}>
                            {formUpdateData.plant === "P1 - PLANT 1" ? 
                                (
                                    <CFormInput type="number" inputMode='numeric' id="quantityI" 
                                        value={formUpdateData.quantity_innova}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_innova: e.target.value
                                        }))}/>
                                ) : (
                                    <CFormInput type="number" inputMode='numeric' id="quantityC" 
                                        value={formUpdateData.quantity_calya}  
                                        onChange={(e) => setFormUpdateData((prev) => ({
                                            ...prev, 
                                            quantity_calya: e.target.value
                                        }))}/>
                                )}
                            
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='d-flex btn-add-master align-items-center gap-2' disabled={loading} 
                        onClick={()=> handleUpdateGentani(
                            formUpdateData.gentani_id, 
                            formUpdateData.quantity_fortuner,
                            formUpdateData.quantity_zenix,
                            formUpdateData.quantity_innova,
                            formUpdateData.quantity_avanza,
                            formUpdateData.quantity_yaris,
                            formUpdateData.quantity_calya,
                        )}
                        >
                            { loading && <CSpinner size="sm"/> }
                            Update data
                    </CButton>
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
                            <p>Are you sure want to delete this Gentani ?</p>
                            <p>Material No &emsp;: <span style={{fontWeight: "bold"}}>{formDeleteData.material_no}</span></p>
                            <p>Plant &emsp;&emsp;&emsp;&emsp;: <span style={{fontWeight: "bold"}}>{formDeleteData.plant}</span></p>
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
                    <CRow className='mb-3'>
                        <CFormLabel>Guide for File Upload Requirement Fields</CFormLabel>
                        <div className='px-3'>
                            <CCard >
                                <CCardBody className='w-100'>
                                    <CImage src={ImageGuide} style={{width: "inherit"}}/>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="quantitiy" className="col-form-label col-sm-4">File (.xlsx)<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="file" accept='.xlsx' id="upload" onChange={(e)=>handleChangeUpload(e)}/>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpload(false)}>
                    Close
                    </CButton>
                    <CButton className='d-flex btn-add-master align-items-center gap-2' disabled={loading} onClick={()=>handleCreateByUpload()}>
                        { loading && <CSpinner size='sm'/>}
                        Upload data
                    </CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Upload */}

{/* ---------------------------------------------------------------------------------------------/END OF MODALS-------------------------------------------------------------------------------------------------------------- */}
            
            <CRow>
                {/* <CCol xs={12} xl={3} xxl={4} lg={3} md={6} sm={12}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="materialDesc" className='col-form-label col-lg-12 col-md-12 col-sm-2 col-xl-12 col-xxl-12'>Katashiki</CFormLabel>
                        <CCol className="col-lg-11 col-md-11 col-xl-10 col-xxl-10 d-flex align-items-center justify-content-start gap-2" >
                            <Select options={optionsKatashiki} placeholder="All" isClearable value={optionsKatashiki.find((option) => option.value === searchQuery.katashiki) || null} onChange={(e) => setSearchQuery({ ...searchQuery, katashiki: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                        </CCol>
                    </CRow>
                </CCol> */}
                <CCol xs={12} xl={4} xxl={4} lg={4} md={4} sm={12}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="supplyLine" className="col-form-label col-lg-12 col-md-12 col-sm-2 col-xl-12 col-xxl-12">Material</CFormLabel>
                        <CCol className='col-lg-11 col-md-12 col-xl-10 col-xxl-10 d-flex align-items-center justify-content-start gap-2'>
                            {/* <CFormInput type="text" id="supplyLine" value={searchQuery.materialDescOrNo} onChange={(e)=>setSearchQuery((prev)=>({ ...prev, materialDescOrNo: e.target.value}))}/> */}
                            <Select noOptionsMessage={() =>  "No material found" } options={optionsMaterialDesc} placeholder="All" isClearable value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} className='w-100 cursor-pointer' styles={colorStyles}/>
                            
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xl={3} xxl={3} lg={3} md={3} sm={12}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-lg-12 col-md-12 col-sm-2 col-xl-12 col-xxl-12' >Plant</CFormLabel>
                        <CCol className='col-lg-11 col-md-12 col-sm-8 col-xl-10 col-xxl-10 d-flex align-items-center gap-2'>
                            <CDropdown className='d-flex dropdown-search justify-content-between'>
                                <CDropdownToggle className='d-flex align-items-center justify-content-between w-100'>{searchQuery.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, plant: "All"}))}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, plant: "P1 - Plant 1"}))}>P1 - Plant 1</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, plant: "P2 - Plant 2"}))}>P2 - Plant 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xl={5} xxl={5} lg={5} md={5} sm={12}>
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-lg-12 col-md-12 col-sm-2 col-xl-12 col-xxl-12' >Unit</CFormLabel>
                        <CCol className='col-lg-8 col-md-8 col-sm-8 col-xl-8 col-xxl-8 d-flex align-items-center gap-2'>
                            <CDropdown className='d-flex dropdown-search justify-content-between'>
                                <CDropdownToggle className='d-flex align-items-center justify-content-between w-100'>{searchQuery.unit}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "All"}))}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Fortuner"}))}>Fortuner</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Zenix"}))}>Zenix</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Innova"}))}>Innova</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Avanza"}))}>Avanza</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Yaris"}))}>Yaris</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={() => setSearchQuery((prev)=>({...prev, unit: "Calya"}))}>Calya</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol className="col-lg-4 col-md-4 col-sm-2 col-xl-4 col-xxl-4 d-flex justify-content-end gap-3">
                            <CButton className="btn-search" onClick={()=>handleSearch()}>Search</CButton>
                            <CButton color="secondary" onClick={() => handleClearSearch()}>Clear</CButton>
                        </CCol >
                    </CRow>
                </CCol>
            </CRow>
            <CRow>
                { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && 
                    <CCol xs={12} xxl={12} className='d-flex flex-wrap p-4 gap-3 gap-sm-1 mt-4 mt-xl-0'>
                        <CButton className='col-5 col-sm-auto btn-add-master' onClick={()=>setVisibleModalAdd(true)}>Add Gentani</CButton>
                        {/* <CButton className='col-6 col-sm-auto btn-add-master mx-0 mx-sm-2' onClick={()=>handleModalRatio(ratioProdData)}>Production Rate</CButton> */}
                        <CDropdown className="col-5 col-sm-auto btn-download btn-group mx-0 mx-sm-2">
                            <CDropdownToggle  style={{color: "white"}}>Download</CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem className='cursor-pointer' style={{textDecoration: "none"}} onClick={()=>handleDownloadTemplate()}>Template</CDropdownItem>
                                <CDropdownItem className='cursor-pointer' style={{textDecoration: "none"}} onClick={()=>handleDownload(paginatedData)}>Gentani Data Table</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                        <CButton className='col-6 col-sm-auto btn-upload' onClick={()=>setVisibleModalUpload(true)}>Upload</CButton>
                    </CCol>
                }
            </CRow>
            <CRow>
                <CCol className='text-table-small py-4'>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && <CTableHeaderCell scope="col" colSpan={2} rowSpan={2} className='text-center'>Action</CTableHeaderCell>}
                                {/* <CTableHeaderCell scope="col">Katashiki</CTableHeaderCell> */}
                                <CTableHeaderCell scope="col" rowSpan={2} >Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col" colSpan={6} className='text-center'>Consumption Quantity</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Uom</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} >Changed Date</CTableHeaderCell>
                            </CTableRow>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                <CTableHeaderCell scope="col">Fortuner</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Zenix</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Innova</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Avanza</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Yaris</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Calya</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            { paginatedData && paginatedData.map((gentani, index) => {
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }}>
                                        { (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") && (
                                            <CTableDataCell className='text-center'>
                                                <CButton className='btn-icon-edit' onClick={()=>handleModalUpdate(gentani)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                            </CTableDataCell>
                                        )}
                                        {(
                                          (auth.userData.role_name === "LANE HEAD" ||  auth.userData.role_name === "SUPER ADMIN") &&
                                            <CTableDataCell className='text-center'>
                                                <CButton className='btn-icon-delete' onClick={()=>handleModalDelete(gentani)}><CIcon icon={icon.cilTrash}/></CButton>
                                            </CTableDataCell>
                                        )}
                                        {/* <CTableDataCell>{gentani.katashiki}</CTableDataCell> */}
                                        <CTableDataCell>{gentani.material_no}</CTableDataCell>
                                        <CTableDataCell>{gentani.material_desc}</CTableDataCell>
                                        <CTableDataCell>{gentani.plant}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_fortuner === 0 ? "" : gentani.quantity_fortuner}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_zenix === 0 ? "" : gentani.quantity_zenix}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_innova === 0 ? "" : gentani.quantity_innova}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_avanza === 0 ? "" : gentani.quantity_avanza}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_yaris === 0 ? "" : gentani.quantity_yaris}</CTableDataCell>
                                        <CTableDataCell>{gentani.quantity_calya === 0 ? "" : gentani.quantity_calya}</CTableDataCell>
                                        <CTableDataCell>{gentani.uom}</CTableDataCell>
                                        <CTableDataCell>{gentani.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(gentani.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{gentani.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(gentani.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                            { paginatedData.length === 0 && !loading && 
                                <CTableRow color="light">
                                    <CTableDataCell color="light" colSpan={16}>
                                        <div className='d-flex flex-column align-items-center justify-content-center text-black text-not-found py-2' style={{ opacity: "30%"}}>
                                            <CIcon icon={icon.cilFax} size='3xl'/>
                                            <p className='pt-3'>No data found!</p>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            }
                            { loading && 
                                <CTableRow color=''>
                                    <CTableDataCell colSpan={16}>
                                        <div className='d-flex flex-column align-items-center justify-content-center text-black text-not-found py-2' style={{ opacity: "30%"}}>
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
                <CCol sm={12} xl={12} className='d-flex flex-column flex-xl-row align-items-center justify-content-center gap-4 py-4'>
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