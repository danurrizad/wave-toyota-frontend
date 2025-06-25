/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormInput, CFormLabel, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSupplyLocationService from '../../../services/SupplyLocation'
import { useToast } from '../../../App'
import useHistoryDataService from '../../../services/HistoryDataService'
import useSupplyQtyDataService from '../../../services/SupplyQtyDataService'

const SupplierLocation = () => {
  const addToast = useToast()
  const navigate = useNavigate()
  const { locationName, locationPlant } = useParams()
  const [loading, setLoading] = useState({
    fetch: true,
    modal: false
  })
  const [materials, setMaterials] = useState([])
  const { getSupplyLocationByName } = useSupplyLocationService()
  
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})
  const [defaultQty, setDefaultQty] = useState(0)
  const { getSupplyQtyDataByNoPlant} = useSupplyQtyDataService()
  const { supplyingAndCreateHistory } = useHistoryDataService()

  // fetch list materials
  const fetchSupplyLocationByName = async() => {
    try {
      const response = await getSupplyLocationByName(locationName, locationPlant)
      setMaterials(response?.data?.data[0].materials)
    } catch (error) {
      console.error(error)
    } finally{
      setLoading({ ...loading, fetch: false})
    }
  }

  

  useEffect(()=>{
    fetchSupplyLocationByName()
  }, [])
  

  // blur input
  const handleBlur = () => {
    const adjustedValuePack = Math.ceil(form.qty_pack / 1) * 1;
    const adjustedValueUom = Math.ceil(form.qty_uom / defaultQty) * defaultQty;
    setForm({...form, qty_pack: adjustedValuePack, qty_uom: adjustedValueUom});
  }

  // change by uom
  const handleChangeQtyUom = (e) => {
    setForm({
        ...form,
        qty_uom: e.target.value,
        qty_pack: Math.ceil(e.target.value / defaultQty)
    })
  }
  
  // click by uom  
  const handleClickQtyUom = (upOrDown) => {
    if(upOrDown === "up"){
        setForm({
            ...form, 
            qty_uom: form.qty_uom + defaultQty, 
            qty_pack: Math.ceil( (form.qty_uom + defaultQty) / defaultQty) 
        })
    }
    else if (upOrDown === "down"){
        setForm({
            ...form, 
            qty_uom: form.qty_uom - defaultQty < 0 ? 0 : form.qty_uom - defaultQty,
            qty_pack: Math.ceil( (form.qty_uom - defaultQty) / defaultQty) < 0 ? 0 : Math.ceil( (form.qty_uom - defaultQty) / defaultQty),
        })
    }
  }

  // change by pack
  const handleChangeQtyPack = (e) => {
    setForm({
        ...form,
        qty_pack: e.target.value,
        qty_uom: defaultQty * e.target.value
    })
  }

  // click pack
  const handleClickQtyPack = (upOrDown) => {
    if(upOrDown === "up"){
        setForm({
            ...form, 
            qty_pack: form.qty_pack + 1, 
            qty_uom: defaultQty * (form.qty_pack + 1)
        })
    } else if(upOrDown === "down"){
        setForm({
            ...form, 
            qty_pack: form.qty_pack - 1 < 0 ? 0 : form.qty_pack - 1, 
            qty_uom: defaultQty * (form.qty_pack - 1) < 0 ? 0 : defaultQty * (form.qty_pack - 1)
        })
    }
  }

  // submit
  const handleSupplyAndCreateHistory = async() => {
    try {
      setLoading({ ...loading, submit: true})
      let arrayForm = []
      arrayForm.push(form)
      await supplyingAndCreateHistory(arrayForm)
      addToast("Material successfully supplied!", "success", "success")
      setShowModal(false)
      setForm([])
    } catch (error) {
      console.log(error)
    } finally{
      setLoading({ ...loading, submit: false})
    }
  }

  // render Modal 
  const renderModal = () =>{
      return(
          <CModal
              backdrop="static"
              visible={showModal}
              onClose={handleCloseModal}
              aria-labelledby="AddQuantitySupply"
              >
              <CModalHeader>
                  <CModalTitle id="AddQuantitySupply">Input quantity for supply</CModalTitle>
              </CModalHeader>
              <CModalBody>
                  <CRow className="mb-3">
                      <CFormLabel htmlFor="materialNo" className="col-sm-4 col-form-label">Material No</CFormLabel>
                      <CCol sm={8}>
                          <CFormInput type="text" id="materialNo" disabled value={form.material_no || ""} />
                      </CCol>
                  </CRow>
                  <CRow className="mb-3">
                      <CFormLabel htmlFor="materialDesc" className="col-sm-4 col-form-label">Material Desc</CFormLabel>
                      <CCol sm={8}>
                          <CFormInput type="text" id="materialDesc" disabled value={form.material_desc || ""}/>
                      </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                      <CFormLabel className="col-sm-4 col-form-label">Plant</CFormLabel>
                      <CCol sm={8} className='d-flex align-items-center justify-content-between'>
                          <CDropdown className="btn-group disabled-dropdown" style={{width: "100%"}}  direction="center">
                              <CDropdownToggle  width={400} disabled className='d-flex justify-content-between align-items-center dropdown-search'>{form.plant}</CDropdownToggle>
                              <CDropdownMenu >
                                  <CDropdownItem>P1 - PLANT 1</CDropdownItem>
                                  <CDropdownItem>P2 - PLANT 2</CDropdownItem>
                              </CDropdownMenu>
                          </CDropdown>
                      </CCol>
                  </CRow>
                  <CRow className="mb-3">
                      <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Uom</CFormLabel>
                      <CCol sm={8}>
                          <CFormInput type="text" id="uom" disabled value={form.uom || ""}/>
                      </CCol>
                  </CRow>
                  <CRow className="mb-3">
                      <CFormLabel htmlFor="uom" className="col-sm-4 col-form-label">Pack</CFormLabel>
                      <CCol sm={8}>
                          <CFormInput type="text" id="uom" disabled value={form.pack || ""}/>
                      </CCol>
                  </CRow>
                  <CRow className="mb-">
                      <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">Quantity</CFormLabel>
                  </CRow>
                  <CRow className="mb-3  d-flex align-items-center">
                      <CFormLabel htmlFor="qty_pack" className="col-sm-4 col-form-label">By Pack<span style={{color: "red"}}>*</span></CFormLabel>
                      <CCol sm={6} xs={9}>
                          <CInputGroup>
                              <CFormInput type="number" id="qty_pack" step={1} value={form.qty_pack} onBlur={handleBlur} onChange={handleChangeQtyPack}/>
                              <div className='d-flex flex-column'>
                                  <button className='btn-number up' onClick={() => handleClickQtyPack("up")}><CIcon icon={icon.cilCaretTop}/></button>
                                  <button className='btn-number down' onClick={() => handleClickQtyPack("down")}><CIcon icon={icon.cilCaretBottom}/></button>
                              </div>
                          </CInputGroup>
                      </CCol>
                      <CCol sm={2} xs={3}>
                          <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">{form.pack}</CFormLabel>
                      </CCol>
                  </CRow>
                  <CRow className="mb-3 d-flex align-items-center">
                      <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">By Uom<span style={{color: "red"}}>*</span></CFormLabel>
                      <CCol sm={6} xs={9}>
                          <CInputGroup>
                              <CFormInput type="number" id="qty" step={defaultQty} value={form.qty_uom} onBlur={handleBlur} onChange={handleChangeQtyUom}/>
                              <div className='d-flex flex-column'>
                                  <button className='btn-number up' onClick={()=>handleClickQtyUom("up")}><CIcon icon={icon.cilCaretTop}/></button>
                                  <button className='btn-number down' onClick={()=>handleClickQtyUom("down")}><CIcon icon={icon.cilCaretBottom}/></button>
                              </div>
                          </CInputGroup>
                      </CCol>
                      <CCol sm={2} xs={3}>
                          <CFormLabel htmlFor="qty" className="col-sm-4 col-form-label">{form.uom}</CFormLabel>
                      </CCol>
                  </CRow>
                  <CRow className="mb-3 d-flex align-items-center">
                      <CFormLabel htmlFor="supply_by" className="col-sm-4 col-form-label">User Name<span style={{color: "red"}}>*</span></CFormLabel>
                      <CCol sm={8}>
                          <CFormInput type="text" id="supply_by" placeholder='Input your name' onChange={(e)=>setForm({ ...form, supply_by: e.target.value })} value={form.supply_by || ""}/>
                      </CCol>
                  </CRow>
              </CModalBody>
              <CModalFooter>
                  <CButton color="secondary" className='btn-close-red' onClick={handleCloseModal}>
                  Close
                  </CButton>
                  <CButton className='btn-add-master d-flex align-items-center gap-2' disabled={!form.supply_by || form.supply_by === ""} onClick={()=>handleSupplyAndCreateHistory(form)}>
                      { loading.submit && <CSpinner size='sm'/>}
                      Apply input
                  </CButton>
              </CModalFooter>
          </CModal>
        )
      }

  // open modal and fetch data supply qty
  const handleOpenModal = async(material_no, plant) => {
    try {
      setLoading({ ...loading, modal: true})
      const response = await getSupplyQtyDataByNoPlant(material_no, plant)
      const data = response.data.data
      setForm({
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
      setShowModal(true)
    } catch (error) {
      console.error(error)
    } finally{
      setLoading({ ...loading, modal: false})
    }
  }

  // close modal
  const handleCloseModal = () => {
    setForm({})
    setShowModal(false)
  }



  return (
    <div className='min-vh-100 p-3 py-5 position-relative'>
      {renderModal()}
      
      {/* button back */}
      <div className='position-absolute start-3 top-0 mt-1'>
        <CButton onClick={()=>navigate('/supplier-location')} className='d-flex align-items-center gap-3'>
          <CIcon icon={icon.cilArrowLeft}/>
          Back
        </CButton>
      </div>

      <h1 className='text-center'>{locationName}</h1>
      <h2 className='text-center fw-normal'>{locationPlant}</h2>
      <div className='h-100 d-flex justify-content-center flex-column' style={{ marginTop: '100px'}}>
        <h5 className='text-center'>Please select material to be supplied</h5>
        {materials.length > 0 && materials.map((item, index)=>{
          return (
            <div key={index} className='w-100 mt-2'>
              <div className='w-100 '>
                <CButton onClick={()=>handleOpenModal(item.material_no, item.plant)} color='secondary' className='w-100 py-5 text-white d-flex flex-column align-items-center justify-content-between'>
                  <h5>{item.material_no} </h5>
                  <h4>{item.material_desc}</h4>
                </CButton>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SupplierLocation