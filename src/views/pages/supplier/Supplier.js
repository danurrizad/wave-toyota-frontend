/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState, useRef } from 'react'
import useHistoryDataService from '../../../services/HistoryDataService'
import useSupplyQtyDataService from '../../../services/SupplyQtyDataService'
import HeaderSupplier from '../../../components/header/HeaderSupplier'
import templateToast from '../../../components/ToasterComponent'

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
    CModalTitle,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CSpinner,
    CToaster,
  } from '@coreui/react'

import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";
import QrReader from '../../../utils/ReaderQR'
import Select from 'react-select'


function Supplying() {
    const [showScanner, setShowScanner] = useState(false)
    const [visibleModalAdd, setVisibleModalAdd] = useState(false)
    const [visibleModalScanner, setVisibleModalScanner] = useState(false)
    const [formData, setFormData] = useState({
        material_no: "",
        material_desc: "",
        plant: "",
        uom: "",
        qty: 0,
        supply_by: ""
    })
    const [defaultQty, setDefaultQty] = useState(0)
    const [loading, setLoading] = useState(false)
    const { getSupplyQtyData} = useSupplyQtyDataService()
    const { supplyingAndCreateHistory } = useHistoryDataService()
    const [supplyQtyData, setSupplyQtyData] = useState([])
    const [filteredData, setFilteredData] = useState([])

  const getSupplyQty = async() => {
    try {
        setLoading(true)
      const response = await getSupplyQtyData('supply-qty')
      const filtered = response.data.data.filter((data) => data.qty !== 0)
      setSupplyQtyData(filtered)
      setFilteredData(filtered)
    } catch (error) {
      console.log(error)
    } finally{
        setLoading(false)
    }
  }

  const handleSupplyAndCreateHistory = async(data) => {
    try {
        if(data.supply_by === "" || data.supply_by === null) {
            addToast(templateToast("Error", "Please insert your name!"))
            return
        }
        const response = await supplyingAndCreateHistory(data)
        addToast(templateToast("Success", response.data.message))
        setVisibleModalAdd(false)
        getSupplyQty()
    } catch (error) {
        console.log(error)
        if(error.response){
            addToast(templateToast("Error", error.response.data.message))
        }
        addToast(templateToast("Error", error.message))
    }
  }


    // Handler for when the input loses focus
  const handleBlur = () => {
    // Round the value to the nearest step
    const adjustedValue = Math.ceil(formData.qty / defaultQty) * defaultQty;
    setFormData({...formData, qty: adjustedValue});
  };
  
  useEffect(()=>{
    getSupplyQty()
  }, [])


  const [totalPage, setTotalPage] = useState(0)
  const [itemPerPage, setItemPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState({
    materialDescOrNo: "",
    materialNo:"",
    plant: "All"
  })
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const optionsMaterialDesc = Array.from(
    new Map(
      supplyQtyData.map((material) => [material.material_desc, material]) // Use a Map to remove duplicates by material_desc
    ).values()
  ).map((material) => ({
    value: material.material_no, // Use material_desc as the value
    label: `${material.material_no} - ${material.material_desc}`, // Combine material_no and material_desc for the label
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

  const handleSearch = () => {
    const {  materialDescOrNo, plant } = searchQuery 

    const filtered = supplyQtyData.filter(supply => {
        const matchesDescorNo = supply.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase()) || supply.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase())
        const matchesPlant = plant === "All" || supply.plant.toLowerCase().includes(plant.toLowerCase())
        return matchesDescorNo && matchesPlant
    })

    setFilteredData(filtered)
    setTotalPage(Math.ceil(filtered.length / itemPerPage))
    setCurrentPage(1); // Reset to the first page
};

  const handleClearSearch = () => {
    setSearchQuery({materialDescOrNo: "", materialNo: "", plant: "All"})
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


  const handleModalAdd = (data) => {
    setVisibleModalAdd(true)
    setFormData({
        material_no: data.material_no,
        material_desc: data.material_desc,
        plant: data.plant,
        uom: data.uom,
        qty: data.qty,
        supply_by: ""
    })
    setDefaultQty(data.qty)
  }


  const renderModalUpdate = () =>{
    return(
        <CContainer >
            {/* Start of Modal Update */}
        <CModal
            backdrop="static"
            visible={visibleModalAdd}
            onClose={() => setVisibleModalAdd(false)}
            aria-labelledby="AddQuantitySupply"
            >
            <CModalHeader>
                <CModalTitle id="AddQuantitySupply">Input quantity for supply</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Material No</CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="materialNo" disabled value={formData.material_no || ""} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="materialDesc" className="col-sm-4 col-form-label">Material Desc</CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="materialDesc" disabled value={formData.material_desc || ""}/>
                    </CCol>
                </CRow>
                <CRow className='mb-3'>
                    <CFormLabel className="col-sm-4 col-form-label">Plant</CFormLabel>
                    <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                        <CDropdown className="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
                            <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{formData.plant}</CDropdownToggle>
                            <CDropdownMenu >
                                <CDropdownItem onClick={()=>setFormData((prev)=>({ ...prev, plant: "P1 - PLANT 1"}))}>P1 - PLANT 1</CDropdownItem>
                                <CDropdownItem onClick={()=>setFormData((prev)=>({ ...prev, plant: "P2 - PLANT 2"}))} >P2 - PLANT 2</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Uom</CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="uom" disabled value={formData.uom || ""}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">Quantity<span style={{color: "red"}}>*</span></CFormLabel>
                    <CCol sm={8}>
                        <CInputGroup>
                            <CFormInput type="number" id="qty" step={defaultQty} value={formData.qty} onBlur={handleBlur} onChange={(e) => setFormData({...formData, qty: e.target.value})}/>
                            <div className='d-flex flex-column'>
                                <button className='btn-number up' onClick={()=>setFormData({...formData, qty: formData.qty+defaultQty})}><CIcon icon={icon.cilCaretTop}/></button>
                                <button className='btn-number down' onClick={()=>setFormData({...formData, qty: formData.qty - defaultQty < 0 ? 0 : formData.qty-defaultQty})}><CIcon icon={icon.cilCaretBottom}/></button>
                            </div>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="supplyBy" className="col-sm-4 col-form-label">Supplier Name<span style={{color: "red"}}>*</span></CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="supplyBy" value={formData.supply_by || ""} onChange={(e)=>setFormData({...formData, supply_by: e.target.value})}/>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalAdd(false)}>
                Close
                </CButton>
                <CButton className='btn-add-master' onClick={()=>handleSupplyAndCreateHistory(formData)}>Apply input</CButton>
            </CModalFooter>
        </CModal>
        {/* End of Modal Update */}
        </CContainer>
      )
    }

    {/* Start of Modal Scanner */}
    const renderModalScanner = () => {
        return(
            <CContainer>
                <CModal
                    visible={visibleModalScanner}
                    onClose={() => setVisibleModalScanner(false)}
                    aria-labelledby="ScanQR"
                    >
                    <CModalHeader>
                        <CModalTitle id="ScanQR">Scan QR Code Material</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <QrReader setShowScanner={setShowScanner} setVisibleModalAdd={setVisibleModalAdd} setVisibleModalScanner={setVisibleModalScanner} setFormData={setFormData} setDefaultQty={setDefaultQty}/>
                    </CModalBody>
                </CModal>
        </CContainer>
        )
    }
    

  useEffect(() => {
    document.title = "Andon Visualization - Supplier"; // Set the document title
    return () => {
      document.title = "Andon Visualization"; // Optional: Reset the title on component unmount
    };
  }, []);
  
  return (
      <div className='text-sm' style={{backgroundColor: "#F3F4F7", minHeight: "100vh"}} >
        <HeaderSupplier/>
        <CContainer>
            
        {/* Loading Spinner */}
        { loading && <div className="loading"><CSpinner /></div>}

        {/* Toast */}
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

        {renderModalUpdate()}
        {renderModalScanner()}

        <CRow className='py-4 d-flex align-items-start'>
            <CCol className='text-center'>
                <h1>Master Supplier Material</h1>
                <h6>Input quantity to supply material</h6>
            </CCol>
        </CRow>
        
        <CRow className='d-flex justify-between gap-xl-4 flex-column flex-xl-row'>
            <CCol xl={4}>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="materialDesc" className='col-xl-2 col-form-label col-md-3'>Material</CFormLabel>
                    <CCol className="d-flex align-items-center justify-content-start gap-2" >
                        {/* <CFormInput type="text" id="materialDesc" value={searchQuery.materialDescOrNo} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e.target.value })} /> */}
                        <Select noOptionsMessage={() =>  "No material found" } options={optionsMaterialDesc} placeholder="All" isClearable value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                    </CCol>
                </CRow>
            </CCol>
            <CCol></CCol>
            <CCol className="" xl={4}>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="plant" className='col-sm-2 col-form-label col-md-3' >Plant</CFormLabel>
                    <CCol className='d-flex align-items-center gap-2 col-sm-8 col-md-6'>
                        <CDropdown className='dropdown-search d-flex justify-content-between'>
                            <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                            <CDropdownMenu className='cursor-pointer'>
                                <CDropdownItem style={{ textDecoration: "none" }} className="active:bg-black focus:bg-black" onClick={() => setSearchQuery({ ...searchQuery, plant: "All" })}>All</CDropdownItem>
                                <CDropdownItem style={{ textDecoration: "none" }} className="active:bg-black focus:bg-black" onClick={() => setSearchQuery({ ...searchQuery, plant: "P1 - PLANT 1" })}>P1 - PLANT 1</CDropdownItem>
                                <CDropdownItem style={{ textDecoration: "none" }} className="active:bg-black focus:bg-black" onClick={() => setSearchQuery({ ...searchQuery, plant: "P2 - PLANT 2" })}>P2 - PLANT 2</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                    <CCol  className="d-flex justify-content-end gap-3 col-sm-2 col-md-3">
                        <CButton className='btn-search' onClick={()=>handleSearch()}>Search</CButton>
                        <CButton color='secondary' className='' onClick={() => handleClearSearch()}>Clear</CButton>
                    </CCol >
                </CRow>
            </CCol>
        </CRow>

        <CRow>
            <CCol>
                <CButton className='btn-add-master d-flex align-items-center gap-2' onClick={()=>setVisibleModalScanner(true)}><CIcon icon={icon.cilQrCode} size='lg'/>Input by QR-Code</CButton>
            </CCol>
        </CRow>

        {/* {showScanner && <QrReader setShowScanner={setShowScanner} setVisibleModalAdd={setVisibleModalAdd} setFormData={setFormData} setDefaultQty={setDefaultQty}/>} */}

       <CRow className='overflow-y-auto p-3'>
        <CTable bordered striped style={{fontSize: "12px"}}>
            <CTableHead>
                <CTableRow color='dark' className=''>
                        <CTableHeaderCell scope="col" className="text-center">Action</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Uom</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {paginatedData && paginatedData.map((supply, index)=>{
                    return(
                        <CTableRow key={index}>
                            <CTableDataCell className="text-center">
                                <CButton  onClick={()=>handleModalAdd(supply)} className="btn-icon-edit">
                                    <CIcon icon={icon.cilInput} className=''/>
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>{supply.material_no}</CTableDataCell>
                            <CTableDataCell>{supply.material_desc}</CTableDataCell>
                            <CTableDataCell>{supply.plant}</CTableDataCell>
                            <CTableDataCell>{supply.uom}</CTableDataCell>
                        </CTableRow>
                    )
                })}
            </CTableBody>
        </CTable>
        { paginatedData.length === 0 && !loading && <h2 className='text-center py-4'>No material found!</h2>}
        { loading && <h2 className='text-center py-4'>...</h2>}
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
    </div>
  )
}

export default Supplying
