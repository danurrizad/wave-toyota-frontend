/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import useMasterDataService from '../../../services/MasterDataService'
import {
    CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormText,
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
import { cilPen, cilPlus, cilTrash } from '@coreui/icons'
import Select from 'react-select'
import useUsersDataService from '../../../services/UsersDataService'
import { useAuth } from '../../../utils/context/authContext'

const User = () => {
  const [loading, setLoading] = useState(false)
  const [visibleModal, setVisibleModal] = useState({
    state: false,
    type: "add"
  })
  const [form, setForm] = useState({})
  const [dataUser, setDataUser] = useState([])
  const [optionsRole, setOptionsRole] = useState([])
  const { getMasterData } = useMasterDataService()
  const { updateUserById, register, deleteUserById } = useUsersDataService()
  const auth = useAuth()

  const fetchRole = async() => {
    try {
        setLoading(true)
        const response = await getMasterData('role')
        const options = response.data.data.map((data)=>{
            return{
                label: data.role_name,
                value: data.id
            }
        })
        setOptionsRole(options)
    } catch (error) {
        console.error(error)
    } finally{
        setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await getMasterData('users')
      setDataUser(response.data.data)
    } catch (error) {
      console.error(error)
    } finally{
        setLoading(false)
    }
  }

  const handleShowModal = (type, formData) => {
    setVisibleModal({ state: true, type: type})
    if(type === 'update' || type === 'delete'){
        setForm({
            username: formData.username,
            id: formData.id,
            email: formData.email,
            roleId: formData.roleId
        })
    } else if(type === 'add'){
        setForm({
            username: "",
            email: "",
            roleId: null
        })
    }
  }

  const handleSubmitUser = async(type, formData) => {
    try {
        setLoading(true)
        if(type==='add'){
           await register(formData)
        }else if(type==='update'){
            await updateUserById(formData.id, formData)
        }
        fetchUser()
        setVisibleModal({ ...visibleModal, state: false})
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  const handleDeleteUser = async(id) => {
    try {
        setLoading(true)
        await deleteUserById(id)
        fetchUser()
        setVisibleModal({ ...visibleModal, state: false})
    } catch (error) {
        console.error(error)
    } finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchRole()
  }, [])

  const renderModal = (type, formData) => {
      if(type === 'delete'){
          return(
              <CModal
                  backdrop="static"
                  visible={visibleModal.state}
                  onClose={() => setVisibleModal({ ...visibleModal, state: false })}
                  aria-labelledby="DeleteUser"
              >
                  <CModalHeader>
                      <CModalTitle>Delete User</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                      <CRow>
                          <CFormLabel>Are you sure want to delete this User?</CFormLabel>                        
                      </CRow>
                      <CRow>
                          <CFormLabel style={{ fontWeight: "bold"}}>Username : {formData?.username}</CFormLabel>
                      </CRow>
                  </CModalBody>
                  <CModalFooter>
                      <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModal({ ...visibleModal, state: false })}>
                          Close
                      </CButton>
                      <CButton color='danger' className='d-flex align-items-center gap-2' style={{ color: "white"}} onClick={()=>handleDeleteUser(formData?.id)}>
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
                  aria-labelledby="ModalUser"
              >
                  <CModalHeader>
                      <CModalTitle>{ type === 'add' ? "Register User" : "Update User" }</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                      <CRow className='mb-3'>
                          <CCol xs={3}>
                              <CFormLabel>Username</CFormLabel>
                          </CCol>
                          <CCol>
                              <CFormInput
                                  disabled={type==='update'}
                                  value={form?.username}
                                  onChange={(e)=>setForm({...form, username: e.target.value})}
                                  onKeyDown={(e)=>{
                                      if(e?.key === 'Enter'){
                                          handleSubmitUser(type, form)
                                      }
                                  }}
                              />
                          </CCol>
                      </CRow>
                      <CRow className='mb-3'>
                          <CCol xs={3}>
                              <CFormLabel>Email</CFormLabel>
                          </CCol>
                          <CCol>
                              <CFormInput
                                  disabled={type==='update'}
                                  value={form?.email}
                                  onChange={(e)=>setForm({...form, email: e.target.value})}
                                  onKeyDown={(e)=>{
                                      if(e?.key === 'Enter'){
                                          handleSubmitUser(type, form)
                                      }
                                  }}
                              />
                          </CCol>
                      </CRow>
                      <CRow className='mb-3'>
                          <CCol xs={3}>
                              <CFormLabel>Role</CFormLabel>
                          </CCol>
                          <CCol>
                              <Select
                                options={optionsRole}
                                isClearable
                                value={optionsRole.find((opt)=>opt.value === form.roleId) || ""}
                                onChange={(e)=>setForm({ ...form, roleId: e !== null ? e.value : null})}
                              />
                          </CCol>
                      </CRow>
                      { type === 'add' && 
                        <CRow>
                            <CFormText>Default password will be : <span style={{ fontWeight: "bold"}}>toyota123</span></CFormText>
                        </CRow>
                      }
                  </CModalBody>
                  <CModalFooter>
                      <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModal({ ...visibleModal, state: false})}>
                          Close
                      </CButton>
                      <CButton className='btn-add-master d-flex align-items-center gap-2' onClick={()=>handleSubmitUser(type, form)}>
                          { loading && <CSpinner size='sm'/> }
                          { type === 'add' ? "Add user" : "Save change" }
                      </CButton>
                  </CModalFooter>
              </CModal>
          )
      }
    }

  return (
    <>
    <CContainer fluid >
      <CRow>
            <CCol>
                <CButton className='btn-add-master d-flex align-items-center justify-content-center gap-2' onClick={()=>handleShowModal("add", form)}>
                    <CIcon icon={cilPlus}/>
                    Register New User
                </CButton>
            </CCol>
        </CRow>

        { renderModal(visibleModal.type, form) }

      <CRow className=" pt-4">
        <CTable bordered striped responsive className='text-table-small'>
          <CTableHead>
            <CTableRow color="dark" style={{ verticalAlign: "middle" }}>
                <CTableHeaderCell style={{ width: "100px", minWidth: "100px"}} className=''>Action</CTableHeaderCell>
                <CTableHeaderCell style={{ width: "50px"}}>No</CTableHeaderCell>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {dataUser?.map((data, index) => {
                return (
                <CTableRow key={index} className="">
                    <CTableDataCell align="top">
                        <CButton className='btn-icon-edit' onClick={()=>handleShowModal('update', data)}>
                            <CIcon icon={cilPen}/>
                        </CButton>
                        <CButton className='btn-icon-delete ms-2' disabled={auth?.userData?.username === data.username} onClick={()=>handleShowModal('delete', data)}>
                            <CIcon icon={cilTrash}/>
                        </CButton>
                    </CTableDataCell>
                    <CTableDataCell align="top">{index + 1}</CTableDataCell>
                    <CTableDataCell align="top">{data.username}</CTableDataCell>
                    <CTableDataCell align="top">{data.email}</CTableDataCell>
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

export default User
