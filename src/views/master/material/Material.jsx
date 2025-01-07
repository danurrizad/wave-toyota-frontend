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
    CSpinner
} from '@coreui/react'

import dayjs from 'dayjs';
import useMaterialDataService from '../../../services/MaterialDataService'
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";
import Select from 'react-select'

import { useAuth } from '../../../utils/context/authContext';
import templateToast from '../../../components/ToasterComponent';

const Material = () => {
    const [loading, setLoading] = useState(false)
    const [visibleModalAdd, setVisibleModalAdd] = useState(false)
    const [visibleModalUpdate, setVisibleModalUpdate] = useState(false)
    const [visibleModalDelete, setVisibleModalDelete] = useState({ 
        state: false, 
        desc: "" 
    })

    const auth = useAuth()
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    
    const { getMaterialData, createMaterialData, updateMaterialData, deleteMaterialData } = useMaterialDataService()

    const [materialData, setMaterialData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [formAddData, setFormAddData] = useState({
        material_no: "",
        material_desc: "",
        plant: "Select",
        andon_display: "",
        depth_material: null,
        supply_line: "",
        uom: "Select",
        pack: "Select",
        created_by: auth.user,
        updated_by: ""
    })
    const [formUpdateData, setFormUpdateData] = useState([{
        material_no: "",
        material_desc: "",
        plant: "Select",
        andon_display: "",
        depth_material: 0,
        supply_line: "",
        uom: "Select",
        pack: "Select",
        created_by: "",
        updated_by: auth.user
    }
    ])

    const handleOpenModalUpdate = (data) => {
        setVisibleModalUpdate(true)
        setFormUpdateData({
            material_no: data.material_no,
            material_desc: data.material_desc,
            plant: data.plant,
            andon_display: data.andon_display,
            depth_material: data.depth_material,
            supply_line: data.supply_line,
            uom: data.uom,
            pack: data.pack,
            created_by: data.created_by,
            updated_by: auth.user
        })
    }

    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState(0)


    const [searchQuery, setSearchQuery] = useState({ materialDescOrNo: "", supplyLine: "", plant: "All" })
    
    const optionsMaterialDesc = Array.from(
        new Map(
          materialData.map((material) => [material.material_desc, material]) // Use a Map to remove duplicates by material_desc
        ).values()
      ).map((material) => ({
        value: material.material_no, // Use material_desc as the value
        label: `${material.material_no} - ${material.material_desc}`, // Combine material_no and material_desc for the label
      }));
      
    const optionsSupplyLine = Array.from(
        new Set(materialData.map((material) => material.supply_line))
      ).map((uniqueSupplyLine) => ({
        value: uniqueSupplyLine,
        label: uniqueSupplyLine,
      }));
    
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

    
    useEffect(() => {
        getMaterial();
    }, [])

    const getMaterial = async () => {
        try {
            setLoading(true)
            const response = await getMaterialData('material')

            setMaterialData(response.data)
            setFilteredData(response.data) // Initialize filtered data
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

    const handleSearch = () => {
        const { materialDescOrNo, supplyLine, plant } = searchQuery;

        const filtered = materialData.filter(material => {
            const matchesDescOrNo = material.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase()) || material.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase());
            const matchesSupplyLine = material.supply_line.toLowerCase().includes(supplyLine.toLowerCase());
            const matchesPlant = plant === "All" || material.plant.toLowerCase().includes(plant.toLowerCase());
            return matchesDescOrNo && matchesSupplyLine && matchesPlant;
        });

        setFilteredData(filtered);
        setTotalPage(Math.ceil(filtered.length / itemPerPage));
        setCurrentPage(1); // Reset to first page
    };

    const handleClearSearch = () => {
        setSearchQuery({ materialDescOrNo: "", supplyLine: "", plant: "All" });
        setFilteredData(materialData);
        setTotalPage(Math.ceil(materialData.length / itemPerPage));
        setCurrentPage(1);
    };

    const handleSetItemPerPage = (item) =>{
        setItemPerPage(item)
        setCurrentPage(1)
    }

    useEffect(() => {
        setTotalPage(Math.ceil(filteredData.length / itemPerPage));
    }, [filteredData, itemPerPage]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);

    const handleCreateMaterial = async(formData) =>{
        if(formData.plant == "Select"){
            addToast(templateToast("Error", "Please select Plant!"))
            return
        }
        if(formData.uom == "Select"){
            addToast(templateToast("Error", "Please select Uom!"))
            return
        }
        if(formData.pack == "Select"){
            addToast(templateToast("Error", "Please select Pack!"))
            return
        }
        try {
            setLoading(true)
            const response = await createMaterialData('material', formData)
            addToast(templateToast("Success", response.data.message))
            setVisibleModalAdd(false)
            setFormAddData({...formAddData, material_no: "", material_desc: "", plant: "Select", depth_material: 0, supply_line: "", uom: "Select", pack: "Select"})
            getMaterial()
            
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

    const handleUpdateMaterial = async(materialNo, formData) => {
        try {
            setLoading(true)
            const response = await updateMaterialData('material', materialNo, formData)
            addToast(templateToast("Success", response.data.message))
            setVisibleModalUpdate(false)
            getMaterial()
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

    const handleDeleteMaterial = async(noMaterial, plant) => {
        try {
            setLoading(true)
            const response = await deleteMaterialData(`material/${noMaterial}/${plant}`)
            addToast(templateToast("Success", response.data.message))
            setVisibleModalDelete({state: false, desc: "", plant: ""})
            getMaterial()
        } catch (error) {
            // console.log(error)
            if(error.response){
                addToast(templateToast("Error", error.response.data.message))
            } else {
                addToast(templateToast("Error", error.message))
            }
        } finally{
            setLoading(false)
        }
    }
    

    return (
        <>
        <CContainer fluid >
             {/* Loading Spinner */}
             { loading && <div className="loading"><CSpinner /></div>}

            {/* Toast */}
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

            {/* Start of Modal Add */}
            <CModal
                backdrop="static"
                visible={visibleModalAdd}
                onClose={() => setVisibleModalAdd(false)}
                aria-labelledby="AddMaterialData"
                >
                <CModalHeader>
                    <CModalTitle id="AddMaterialData">Insert Material Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Material No<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" required id="materialNo" onChange={(e) => setFormAddData((prev) => ({ ...prev, material_no: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialDesc" className="col-sm-4 col-form-label">Material Desc<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialDesc" required onChange={(e) => setFormAddData((prev) => ({ ...prev, material_desc: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Plant<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formAddData.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({ ...prev, plant: "P1 - PLANT 1"}))}>P1 - PLANT 1</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({ ...prev, plant: "P2 - PLANT 2"}))} >P2 - PLANT 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="depthMaterial" className="col-sm-4 col-form-label">Depth Material<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="depthMaterial" onChange={(e) => setFormAddData((prev) => ({ ...prev, depth_material: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="andonDisplay" className="col-sm-4 col-form-label">Andon Display<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="andonDisplay" onChange={(e) => setFormAddData((prev) => ({ ...prev, andon_display: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="supplyLine" className="col-sm-4 col-form-label">Supply Line<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="supplyLine" onChange={(e) => setFormAddData((prev) => ({ ...prev, supply_line: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Uom<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formAddData.uom}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, uom: "Gram"}))}>Gram</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, uom: "Liter"}))}>Liter</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, uom: "Meter"}))}>Meter</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, uom: "Kilogram"}))}>Kilogram</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Pack<span style={{color: "red"}}>*</span></CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formAddData.pack}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, pack: "Drum"}))}>Drum</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, pack: "Bulk"}))}>Bulk</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormAddData((prev)=>({...prev, pack: "Tube"}))}>Tube</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalAdd(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleCreateMaterial(formAddData)}>Add data</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Add */}
            
            {/* Start of Modal Update */}
            <CModal
                backdrop="static"
                visible={visibleModalUpdate}
                onClose={() => setVisibleModalUpdate(false)}
                aria-labelledby="UpdateMaterialData"
                >
                <CModalHeader>
                    <CModalTitle id="UpdateMaterialData">Update Material Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Material No</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialNo" disabled value={formUpdateData.material_no || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, material_no: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialDesc" className="col-sm-4 col-form-label">Material Desc</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="materialDesc" value={formUpdateData.material_desc || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, material_desc: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Plant</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown disabled className="btn-group disabled-dropdown" style={{width: "100%"}} direction="center">
                                <CDropdownToggle disabled width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P2 - PLANT 2"}))} >P2 - PLANT 2</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({ ...prev, plant: "P1 - PLANT 1"}))}>P1 - PLANT 1</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="depthMaterial" className="col-sm-4 col-form-label">Depth Material</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="number" id="depthMaterial" value={formUpdateData.depth_material || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, depth_material: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="andonDisplay" className="col-sm-4 col-form-label">Andon Display</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="andonDisplay" value={formUpdateData.andon_display || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, andon_display: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="supplyLine" className="col-sm-4 col-form-label">Supply Line</CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" id="supplyLine" value={formUpdateData.supply_line || ""} onChange={(e) => setFormUpdateData((prev) => ({ ...prev, supply_line: e.target.value }))}/>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Uom</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.uom}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, uom: "Gram"}))}>Gram</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, uom: "Liter"}))}>Liter</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, uom: "Meter"}))}>Meter</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, uom: "Kilogram"}))}>Kilogram</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow className='mb-3'>
                        <CFormLabel className="col-sm-4 col-form-label">Pack</CFormLabel>
                        <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                            <CDropdown className="btn-group" style={{width: "100%"}} direction="center">
                                <CDropdownToggle  width={400} className='d-flex justify-content-between align-items-center dropdown-search'>{formUpdateData.pack}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, pack: "Drum"}))}>Drum</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, pack: "Bulk"}))}>Bulk</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setFormUpdateData((prev)=>({...prev, pack: "Tube"}))}>Tube</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalUpdate(false)}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleUpdateMaterial(formUpdateData.material_no, formUpdateData)}>Save update</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Update */}

            {/* Start of Modal Delete */}
            <CModal
                backdrop="static"
                visible={visibleModalDelete.state}
                onClose={() => setVisibleModalDelete({state: false, desc:"", plant: ""})}
                aria-labelledby="DeleteMaterialData"
                >
                <CModalHeader>
                    <CModalTitle id="DeleteMaterialData">Delete Material Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol>
                            <p>Are you sure want to delete this material ?</p>
                            <p>Material No &emsp;: <span style={{fontWeight: "bold"}}>{visibleModalDelete.desc}</span></p>
                            <p>Plant &emsp;&emsp;&emsp;&emsp;: <span style={{fontWeight: "bold"}}>{visibleModalDelete.plant}</span></p>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalDelete({state: false, desc: "", plant: ""})}>
                    Close
                    </CButton>
                    <CButton className='btn-add-master' onClick={()=>handleDeleteMaterial(visibleModalDelete.desc, visibleModalDelete.plant)}>Delete</CButton>
                </CModalFooter>
            </CModal>
            {/* End of Modal Delete */}

{/* ---------------------------------------------------------------------------------------------/END OF MODALS-------------------------------------------------------------------------------------------------------------- */}            
            
            <CRow>
                <CCol xs={12} xxl={4} xl={4} lg={4} md={6}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="materialDesc" className='col-form-label col-xl-12 col-lg-12 col-md-12 col-sm-2'>Material</CFormLabel>
                        <CCol className="d-flex align-items-center justify-content-start gap-2 col-xl-11 col-md-11">
                            <Select noOptionsMessage={() =>  "No material found" } options={optionsMaterialDesc} placeholder="All" isClearable value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xxl={4} xl={3} lg={3} md={6}>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="supplyLine" className="col-form-label col-xl-12 col-lg-12 col-md-12 col-sm-2">Supply Line</CFormLabel>
                        <CCol className='d-flex align-items-center justify-content-end gap-2 col-xl-11 col-lg-11'>
                            <Select noOptionsMessage={() =>  "No supply line found" } options={optionsSupplyLine} placeholder="All" isClearable value={optionsSupplyLine.find((option) => option.value === searchQuery.supplyLine) || null} onChange={(e) => setSearchQuery({ ...searchQuery, supplyLine: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={12} xxl={4} xl={5} lg={5} md={12} >
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="plant" className='col-form-label col-xl-12 col-lg-12 col-md-12 col-sm-2'>Plant</CFormLabel>
                        <CCol className='d-flex align-items-center gap-2 col-sm-6 col-xl-8 col-lg-7 col-md-8 col-sm-8'>
                            <CDropdown className='dropdown-search d-flex justify-content-between'>
                                <CDropdownToggle className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{ textDecoration: "none"}} onClick={() => setSearchQuery({ ...searchQuery, plant: "All" })}>All</CDropdownItem>
                                    <CDropdownItem style={{ textDecoration: "none"}} onClick={() => setSearchQuery({ ...searchQuery, plant: "P1 - PLANT 1" })}>P1 - PLANT 1</CDropdownItem>
                                    <CDropdownItem style={{ textDecoration: "none"}} onClick={() => setSearchQuery({ ...searchQuery, plant: "P2 - PLANT 2" })}>P2 - PLANT 2</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol  className="d-flex justify-content-end gap-3 col-sm-2 col-xl-4 col-lg-5 col-md-4" >
                            <CButton className='btn-search' onClick={()=>handleSearch()}>Search</CButton>
                            <CButton color="secondary" onClick={() => handleClearSearch()}>Clear</CButton>
                        </CCol >
                    </CRow>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CButton className='btn-add-master' onClick={()=>setVisibleModalAdd(true)}>Add Material Data</CButton>
                </CCol>
            </CRow>

            {/* Table */}
            <CRow>
                <CCol className='py-4 text-table-small '>
                    <CTable bordered striped responsive>
                        <CTableHead>
                            <CTableRow color="dark" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                <CTableHeaderCell scope="col" colSpan={2} className='text-center' >Action</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Andon Display</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Depth Material</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Supply Line</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Uom</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Pack</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Changed Date</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {paginatedData && paginatedData.map((material, index) => {
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }}>
                                        <CTableDataCell className='text-center'>
                                            <CButton className='btn-icon-edit' onClick={()=>handleOpenModalUpdate(material)}><CIcon icon={icon.cilColorBorder}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center' >
                                            <CButton className='btn-icon-delete' onClick={()=>setVisibleModalDelete({state: true, desc: material.material_no, plant: material.plant})}><CIcon icon={icon.cilTrash}/></CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>{material.material_no}</CTableDataCell>
                                        <CTableDataCell>{material.material_desc}</CTableDataCell>
                                        <CTableDataCell>{material.plant}</CTableDataCell>
                                        <CTableDataCell>{material.andon_display}</CTableDataCell>
                                        <CTableDataCell>{material.depth_material}</CTableDataCell>
                                        <CTableDataCell>{material.supply_line}</CTableDataCell>
                                        <CTableDataCell>{material.uom}</CTableDataCell>
                                        <CTableDataCell>{material.pack}</CTableDataCell>
                                        <CTableDataCell>{material.created_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(material.createdAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                        <CTableDataCell>{material.updated_by}</CTableDataCell>
                                        <CTableDataCell>{dayjs(material.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                </CCol>
                    { paginatedData.length === 0 && !loading && 
                        <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                            <CIcon icon={icon.cilFax} size='3xl'/>
                            <p className='pt-3'>No data found!</p>
                        </div>
                    }
                    {loading && <h2 className='text-center py-4'>...</h2>}
            </CRow>

            {/* Pagination */}
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

export default Material