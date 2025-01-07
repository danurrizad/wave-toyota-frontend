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
    CCardText,
  } from '@coreui/react'

import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";
import QrReader from '../../../utils/ReaderQR'
import Select from 'react-select'


function Supplying() {
    const [showScanner, setShowScanner] = useState(false)
    const [visibleModalAdd, setVisibleModalAdd] = useState(false)
    const [visibleModalScanner, setVisibleModalScanner] = useState(false)
    const [visibleModalTransaction, setVisibleModalTransaction] = useState(false)
    const [formData, setFormData] = useState({
        material_no: "",
        material_desc: "",
        plant: "",
        uom: "",
        pack: "",
        qty_pack: 1,
        qty_uom: 0,
        supply_by: ""
    })
    const localSupplyQtyData = JSON.parse(localStorage.getItem('localSupplyQtyData'))
    const localFilteredSupplyQtyData = JSON.parse(localStorage.getItem('localFilteredSupplyQtyData'))
    const localTransactionData = JSON.parse(localStorage.getItem('localTransactionData'))

    const [defaultQty, setDefaultQty] = useState(0)
    const [loading, setLoading] = useState(false)
    const { getSupplyQtyData} = useSupplyQtyDataService()
    const { supplyingAndCreateHistory } = useHistoryDataService()

    const [supplyQtyData, setSupplyQtyData] = useState(localSupplyQtyData)
    const [filteredData, setFilteredData] = useState(localFilteredSupplyQtyData)
    const [transactionData, setTransactionData] = useState(localTransactionData)

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, []);
      
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        const message =
          "Are you sure you want to leave? All provided data will be lost.";
        e.returnValue = message;
        return message;
      };

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
        addToTransaction(data)
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

  const addToTransaction = (data) => {
    const existingTransaction = localStorage.getItem('localTransactionData'); 
    let dataArray = existingTransaction ? JSON.parse(existingTransaction) : []; 
    dataArray.push(data); 
    localStorage.setItem('localTransactionData', JSON.stringify(dataArray)); 
    setTransactionData(JSON.parse(localStorage.getItem('localTransactionData')))
    addToast(templateToast("Success", `Supply for Material No. ${data.material_no} in ${data.plant} added to list!`))
  }

  const removeTransaction = (data) => {
    const existingTransaction = localStorage.getItem('localTransactionData'); 
    let dataArray = existingTransaction ? JSON.parse(existingTransaction) : [];
    dataArray.pop(data); 
    localStorage.setItem('localTransactionData', JSON.stringify(dataArray)); 
    setTransactionData(JSON.parse(localStorage.getItem('localTransactionData')))
    addToast(templateToast("Success", `Supply for Material No. ${data.material_no} in ${data.plant} removed!`))
  }

  const handleSubmitTransaction = async(dataTransaction) => {
    try {
        const response = await supplyingAndCreateHistory(dataTransaction)
        addToast(templateToast("Success", "All materials supply submitted!"))
        setVisibleModalTransaction(false)
        setTransactionData([])
        getSupplyQty()
    } catch (error) {
        if(error.response){
            addToast(templateToast("Error", error.response.data.message))
        } else{
            addToast(templateToast("Error", error.message))
        }
    } finally {
        setLoading(false)
    }
  }

  useEffect(()=>{
    if(transactionData){
        localStorage.setItem('localTransactionData', JSON.stringify(transactionData))
    }
  }, [transactionData])

  const handleBlur = () => {
    const adjustedValuePack = Math.ceil(formData.qty_pack / 1) * 1;
    const adjustedValueUom = Math.ceil(formData.qty_uom / defaultQty) * defaultQty;
    setFormData({...formData, qty_pack: adjustedValuePack, qty_uom: adjustedValueUom});
  };
  
  useEffect(()=>{
    getSupplyQty()
    console.log("transactionData :", transactionData)
  }, [])

  useEffect(()=>{
    if(supplyQtyData){
        localStorage.setItem('localSupplyQtyData', JSON.stringify(supplyQtyData))
    }
    if(filteredData){
        localStorage.setItem('localFilteredSupplyQtyData', JSON.stringify(filteredData))
    }
  }, [supplyQtyData, filteredData])

  useEffect(() => {
        return () => {
        localStorage.removeItem('localSupplyQtyData')
        localStorage.removeItem('localFilteredSupplyQtyData')
        localStorage.removeItem('localTransactionData')
        }
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
      supplyQtyData?.map((material) => [material.material_desc, material]) // Use a Map to remove duplicates by material_desc
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
    // localStorage.setItem('localFilteredSupplyQty', filtered)
    setTotalPage(Math.ceil(filtered.length / itemPerPage))
    setCurrentPage(1); // Reset to the first page
};

  const handleClearSearch = () => {
    setSearchQuery({materialDescOrNo: "", materialNo: "", plant: "All"})
    setFilteredData(supplyQtyData)
    // localStorage.setItem('localFilteredSupplyQty', supplyQtyData)
    setTotalPage(Math.ceil(supplyQtyData.length / itemPerPage))
    setCurrentPage(1)
  }

  const handleSetItemPerPage = (item) => {
    setItemPerPage(item)
    setCurrentPage(1)
  }

    useEffect(() => {
        setTotalPage(Math.ceil(filteredData?.length / itemPerPage));
    }, [filteredData, itemPerPage]);

    const paginatedData = filteredData?.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
    // const paginatedData = localFilteredSupplyQtyData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);


  const handleModalAdd = (data) => {
    setVisibleModalAdd(true)
    setFormData({
        material_no: data.material_no,
        material_desc: data.material_desc,
        plant: data.plant,
        uom: data.uom,
        pack: data.pack,
        qty_pack: 1,
        qty_uom: data.qty,
        supply_by: ""
    })
    setDefaultQty(data.qty)
  }

  const handleChangeQtyPack = (e) => {
    setFormData({
        ...formData,
        qty_pack: e.target.value,
        qty_uom: defaultQty * e.target.value
    })
  }
  const handleChangeQtyUom = (e) => {
    setFormData({
        ...formData,
        qty_uom: e.target.value,
        qty_pack: Math.ceil(e.target.value / defaultQty)
    })
  }

  const handleClickQtyPack = (upOrDown) => {
    if(upOrDown === "up"){
        setFormData({
            ...formData, 
            qty_pack: formData.qty_pack + 1, 
            qty_uom: defaultQty * (formData.qty_pack + 1)
        })
    } else if(upOrDown === "down"){
        setFormData({
            ...formData, 
            qty_pack: formData.qty_pack - 1 < 0 ? 0 : formData.qty_pack - 1, 
            qty_uom: defaultQty * (formData.qty_pack - 1) < 0 ? 0 : defaultQty * (formData.qty_pack - 1)
        })
    }
  }

  const handleClickQtyUom = (upOrDown) => {
    if(upOrDown === "up"){
        setFormData({
            ...formData, 
            qty_uom: formData.qty_uom + defaultQty, 
            qty_pack: Math.ceil( (formData.qty_uom + defaultQty) / defaultQty) 
        })
    }
    else if (upOrDown === "down"){
        setFormData({
            ...formData, 
            qty_uom: formData.qty_uom - defaultQty < 0 ? 0 : formData.qty_uom - defaultQty,
            qty_pack: Math.ceil( (formData.qty_uom - defaultQty) / defaultQty) < 0 ? 0 : Math.ceil( (formData.qty_uom - defaultQty) / defaultQty),
        })
    }
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
                    <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Pack</CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="uom" disabled value={formData.pack || ""}/>
                    </CCol>
                </CRow>
                <CRow className="mb-">
                    <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">Quantity</CFormLabel>
                </CRow>
                <CRow className="mb-3  d-flex align-items-center">
                    <CFormLabel htmlFor="qty_pack" className="col-sm-4 col-form-label">By Pack<span style={{color: "red"}}>*</span></CFormLabel>
                    <CCol sm={6} xs={9}>
                        <CInputGroup>
                            <CFormInput type="number" id="qty_pack" step={1} value={formData.qty_pack} onBlur={handleBlur} onChange={handleChangeQtyPack}/>
                            <div className='d-flex flex-column'>
                                <button className='btn-number up' onClick={() => handleClickQtyPack("up")}><CIcon icon={icon.cilCaretTop}/></button>
                                <button className='btn-number down' onClick={() => handleClickQtyPack("down")}><CIcon icon={icon.cilCaretBottom}/></button>
                            </div>
                        </CInputGroup>
                    </CCol>
                    <CCol sm={2} xs={3}>
                        <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">{formData.pack}</CFormLabel>
                    </CCol>
                </CRow>
                <CRow className="mb-3 d-flex align-items-center">
                    <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">By Uom<span style={{color: "red"}}>*</span></CFormLabel>
                    <CCol sm={6} xs={9}>
                        <CInputGroup>
                            <CFormInput type="number" id="qty" step={defaultQty} value={formData.qty_uom} onBlur={handleBlur} onChange={handleChangeQtyUom}/>
                            <div className='d-flex flex-column'>
                                <button className='btn-number up' onClick={()=>handleClickQtyUom("up")}><CIcon icon={icon.cilCaretTop}/></button>
                                <button className='btn-number down' onClick={()=>handleClickQtyUom("down")}><CIcon icon={icon.cilCaretBottom}/></button>
                            </div>
                        </CInputGroup>
                    </CCol>
                    <CCol sm={2} xs={3}>
                        <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">{formData.uom}</CFormLabel>
                    </CCol>
                </CRow>
                {/* <p className='pb-4'><span style={{fontWeight: "bold"}}>Note</span>{`: A pack of ${formData.pack} is equal to ${formData.qty_uom} ${formData.uom}`}</p> */}

                <CRow className="mb-3">
                    <CFormLabel htmlFor="supplyBy" className="col-sm-4 col-form-label">Supplier Name<span style={{color: "red"}}>*</span></CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="supplyBy" maxLength={20} value={formData.supply_by || ""} onChange={(e)=>setFormData({...formData, supply_by: e.target.value})}/>
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

    {/* Start of Modal Scanner */}
    const renderModalTransaction = () => {
        return(
            <CContainer fluid>
                <CModal
                    size="xl"
                    visible={visibleModalTransaction}
                    onClose={() => setVisibleModalTransaction(false)}
                    aria-labelledby="Transaction"
                    scrollable
                    >
                    <CModalHeader>
                        <CModalTitle id="Transaction">List Material Supplied</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CTable bordered striped style={{fontSize: "12px", verticalAlign: "middle"}}>
                            <CTableHead>
                                <CTableRow color='dark' className='table-head-row'>
                                        <CTableHeaderCell scope="col" className="text-center">No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Supplied By Pack</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Supplied By UoM</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {transactionData && transactionData.map((transaction, index)=>{
                                    return(
                                        <CTableRow key={index}>
                                            <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                                            <CTableDataCell>{transaction.material_no}</CTableDataCell>
                                            <CTableDataCell>{transaction.material_desc}</CTableDataCell>
                                            <CTableDataCell>{transaction.plant}</CTableDataCell>
                                            <CTableDataCell>{transaction.qty_pack}</CTableDataCell>
                                            <CTableDataCell>{transaction.qty_uom}</CTableDataCell>
                                            <CTableDataCell className='text-center' >
                                                <CButton className='btn-icon-delete' onClick={()=>removeTransaction(transaction)}><CIcon icon={icon.cilTrash}/></CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )
                                })}
                                { (transactionData?.length === 0 || transactionData === null) && !loading && 
                                    <CTableRow color="light">
                                        <CTableDataCell color="light" colSpan={7}>
                                            <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                                <CIcon icon={icon.cilFax} size='3xl'/>
                                                <p className='pt-3'>No data found!</p>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                }
                            </CTableBody>
                        </CTable>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalTransaction(false)}>
                            Close
                        </CButton>
                        <CButton className='btn-add-master' onClick={()=>handleSubmitTransaction(transactionData)}>Submit</CButton>
                    </CModalFooter>
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
        {renderModalTransaction()}

        <CRow className='py-4 d-flex align-items-start mb-4'>
            <CCol className='text-center'>
                <h1>Master Supplier Material</h1>
                <h6>Input quantity to supply material</h6>
            </CCol>
        </CRow>
        
        <CRow className='d-flex justify-between gap-xl-4 flex-column flex-xl-row '>
            <CCol xl={4}>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="materialDesc" className='col-xl-2 col-form-label col-md-3 col-sm-2'>Material</CFormLabel>
                    <CCol className="d-flex align-items-center justify-content-start gap-2 " >
                        {/* <CFormInput type="text" id="materialDesc" value={searchQuery.materialDescOrNo} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e.target.value })} /> */}
                        <Select noOptionsMessage={() =>  "No material found" } options={optionsMaterialDesc} placeholder="All" isClearable value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                    </CCol>
                </CRow>
            </CCol>
            <CCol></CCol>
            <CCol className="" xl={4}>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="plant" className='col-sm-2 col-form-label col-md-3 col-xl-2' >Plant</CFormLabel>
                    <CCol className='d-flex align-items-center gap-2 col-sm-8 col-md-6 col-xl-7'>
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
            <CCol xs={5} sm={5} md={4} lg={3} xxl={2}>
                <CButton className='btn-add-master d-flex align-items-center gap-2' onClick={()=>setVisibleModalScanner(true)}><CIcon icon={icon.cilQrCode} size='lg'/>Input by QR-Code</CButton>
            </CCol>
            <CCol>
                <CButton className='btn-add-master d-flex align-items-center gap-2' onClick={()=>setVisibleModalTransaction(true)}><CIcon icon={icon.cilFolderOpen} size='lg'/>List Material Supplied</CButton>
            </CCol>
        </CRow>

        {/* {showScanner && <QrReader setShowScanner={setShowScanner} setVisibleModalAdd={setVisibleModalAdd} setFormData={setFormData} setDefaultQty={setDefaultQty}/>} */}

       <CRow className='overflow-y-auto p-3'>
        <CTable bordered striped style={{fontSize: "12px", verticalAlign: "middle"}}>
            <CTableHead>
                <CTableRow color='dark' className='table-head-row'>
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
        { paginatedData?.length === 0 && !loading && 
            <CTableRow color="light">
                <CTableDataCell color="light" colSpan={7}>
                    <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                        <CIcon icon={icon.cilFax} size='3xl'/>
                        <p className='pt-3'>No data found!</p>
                    </div>
                </CTableDataCell>
            </CTableRow>
        }
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
                        disabled={currentPage === totalPage || filteredData?.length === 0}
                        onClick={() => currentPage < totalPage && setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === totalPage || filteredData?.length === 0}
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
