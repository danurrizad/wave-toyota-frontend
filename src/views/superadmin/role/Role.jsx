/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import useMasterDataService from '../../../services/MasterDataService'
import {
    CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFax, cilPen, cilPlus, cilTrash } from '@coreui/icons'

const Role = () => {
  const [loading, setLoading] = useState(false)
  const [dataRole, setDataRole] = useState([])
  const [form, setForm] = useState({})
  const [visibleModal, setVisibleModal] = useState({
    state: false,
    type: 'add'
  })
  const { getMasterData, postMasterData, updateMasterDataById, deleteMasterDataById } = useMasterDataService()

  const fetchRole = async () => {
    try {
      setLoading(true)
      const response = await getMasterData('role')
      console.log(response)
      setDataRole(response.data.data)
    } catch (error) {
        console.error(error)
    } finally{
        setLoading(false)
    }
  }

  const handleSubmitRole = async(type, form) => {
    try{
        setLoading(true)
        if(type === 'add'){
            await postMasterData('role', form)
        }else if(type === 'update'){
            await updateMasterDataById('role', form.id, form)
        }
        setVisibleModal({ ...visibleModal, state: false })
        fetchRole()
    } catch(error){
        console.error(error)
    } finally{
        setLoading(false)
    }
  }

  const handleDeleteRole = async(id) => {
    try {
        setLoading(true)
        await deleteMasterDataById('role', id)
        fetchRole()
        setVisibleModal({ ...visibleModal, state: false})
    } catch (error) {
        console.error(error)
    } finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchRole()
  }, [])

  const handleShowModal = (type, data) => {
    setVisibleModal({ state: true, type: type})
    if(type === "update"){
        setForm({
            ...form,
            id: data.id,
            role_name: data.role_name
        })
    }else if(type === "add"){
        setForm({
            id: null,
            role_name: ""
        })
    }else if(type === "delete"){
        setForm({
            id: data.id,
            role_name: data.role_name
        })
    }
  }

  const renderModal = (type, formData) => {
    if(type === 'delete'){
        return(
            <CModal
                backdrop="static"
                visible={visibleModal.state}
                onClose={() => setVisibleModal({ ...visibleModal, state: false })}
                aria-labelledby="DeleteRole"
            >
                <CModalHeader>
                    <CModalTitle>Delete Role</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CFormLabel>Are you sure want to delete this Role?</CFormLabel>                        
                    </CRow>
                    <CRow>
                        <CFormLabel style={{ fontWeight: "bold"}}>Role Name : {formData?.role_name}</CFormLabel>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModal({ ...visibleModal, state: false })}>
                        Close
                    </CButton>
                    <CButton color='danger' className='d-flex align-items-center gap-2' style={{ color: "white"}} onClick={()=>handleDeleteRole(formData?.id)}>
                        { loading && <CSpinner size='sm'/> }
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        )
    } else if( type === 'add' || type === 'update'){
        return(
            <CModal
                backdrop="static"
                visible={visibleModal.state}
                onClose={() => setVisibleModal({ ...visibleModal, state: false })}
                aria-labelledby="ModalRole"
            >
                <CModalHeader>
                    <CModalTitle>{ type === 'add' ? "Add Role" : "Update Role" }</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs={3}>
                            <CFormLabel>Role Name</CFormLabel>
                        </CCol>
                        <CCol>
                            <CFormInput
                                value={form?.role_name}
                                onChange={(e)=>setForm({...form, role_name: e.target.value.toUpperCase()})}
                                onKeyDown={(e)=>{
                                    if(e?.key === 'Enter'){
                                        handleSubmitRole(type, form)
                                    }
                                }}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModal({ ...visibleModal, state: false})}>
                        Close
                    </CButton>
                    <CButton className='btn-add-master d-flex align-items-center gap-2' onClick={()=>handleSubmitRole(type, form)}>
                        { loading && <CSpinner size='sm'/> }
                        { type === 'add' ? "Add data" : "Save change" }
                    </CButton>
                </CModalFooter>
            </CModal>
        )
    }
  }



  return (
    <>
    <CContainer fluid>
      <CRow>
        <CCol>
            <CButton className='btn-add-master d-flex align-items-center justify-content-center gap-2' onClick={()=>handleShowModal("add", form)}>
                <CIcon icon={cilPlus}/>
                Add Role
            </CButton>
        </CCol>
      </CRow>

      { renderModal(visibleModal.type, form) }

      <CRow className="pt-4">
        <CTable striped bordered responsive className='text-table-small'>
          <CTableHead>
            <CTableRow color="dark" style={{ verticalAlign: "middle" }}>
                <CTableHeaderCell style={{ width: '100px'}}>Action</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '50px'}}>No</CTableHeaderCell>
                <CTableHeaderCell>Role Name</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading &&
                (<CTableRow color=''>
                    <CTableDataCell colSpan={13}>
                        <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                            <CSpinner/>
                            <p className='pt-3'>Loading data</p>
                        </div>
                    </CTableDataCell>
                </CTableRow>) 
                }
            { dataRole.length === 0 && !loading && 
                <CTableRow color="light">
                    <CTableDataCell color="light" colSpan={13}>
                        <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                            <CIcon icon={cilFax} size='3xl'/>
                            <p className='pt-3'>No data found!</p>
                        </div>
                    </CTableDataCell>
                </CTableRow>
            }
            { (dataRole.length !== 0 && !loading) && dataRole.map((data, index) => {
                return (
                    <CTableRow key={index} className="">
                        <CTableDataCell align="top">
                            <CButton className="btn-icon-edit" onClick={()=>handleShowModal("update", data)}>
                                <CIcon icon={cilPen}/>
                            </CButton>
                            <CButton className="btn-icon-delete ms-2" onClick={()=>handleShowModal("delete", data)}>
                                <CIcon icon={cilTrash}/>
                            </CButton>
                        </CTableDataCell>
                        <CTableDataCell align="top">{index + 1}</CTableDataCell>
                        <CTableDataCell align="top">{data.role_name}</CTableDataCell>
                    </CTableRow>
                )
            })}
          </CTableBody>
        </CTable>
      </CRow>
    </CContainer>
    </>
  )
}

export default Role
