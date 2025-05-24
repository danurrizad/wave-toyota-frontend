/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CButton,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNavLink,
  CRow,
  CSpinner,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
  cilLockUnlocked,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'


import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/context/authContext'
import useUsersDataService from '../../services/UsersDataService'
const AppHeaderDropdown = ({ imgProfile, name, roleName}) => {
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [visibleModal, setVisibleModal] = useState(false)
  const [visibleModalLogout, setVisibleModalLogout] = useState(false)
  const [form, setForm] = useState({})
  const { changePasswordUserById } = useUsersDataService()

  const renderModal = () => {
    return(
      <CModal
        backdrop="static"
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        aria-labelledby="DeleteRole"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
              <CCol xs={4}>
                <CFormLabel>Current Password</CFormLabel>
              </CCol>
              <CCol>
                <CFormInput
                  value={form.currentPass}
                  onChange={(e)=>setForm({ ...form, currentPass: e.target.value})}
                />
              </CCol>
          </CRow>
          <CRow className="mb-3">
              <CCol xs={4}>
                <CFormLabel>New Password</CFormLabel>
              </CCol>
              <CCol>
                <CFormInput
                  value={form.newPass}
                  onChange={(e)=>setForm({ ...form, newPass: e.target.value})}
                />
              </CCol>
          </CRow>
          <CRow className="mb-3">
              <CCol xs={4}>
                <CFormLabel>Confirm Password</CFormLabel>
              </CCol>
              <CCol>
                <CFormInput
                  value={form.confirmPass}
                  onChange={(e)=>setForm({ ...form, confirmPass: e.target.value})}
                />
              </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModal(false)}>
                Close
            </CButton>
            <CButton color='success' className='d-flex align-items-center gap-2' style={{ color: "white"}} onClick={handleChangePassword}>
                { loading && <CSpinner size='sm'/> }
                Change
            </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const renderModalLogout = () => {
    return(
      <CModal
          backdrop="static"
          visible={visibleModalLogout}
          onClose={() => setVisibleModalLogout(false)}
          aria-labelledby="Logout"
          >
          <CModalHeader>
              <CModalTitle id="Logout">Logout</CModalTitle>
          </CModalHeader>
          <CModalBody>
              <CRow>
                  <CCol>
                      <p>Are you sure want to logout?</p>
                  </CCol>
              </CRow>
          </CModalBody>
          <CModalFooter>
              <CButton color="secondary" className='btn-close-red' onClick={() => setVisibleModalLogout(false)}>
              Close
              </CButton>
              <CButton className='btn-add-master' onClick={()=> auth.logOut()}>Yes</CButton>
          </CModalFooter>
      </CModal>
    )
  }

  const handleShowModal = () => {
    setVisibleModal(true)
    setForm({
      currentPass: "",
      newPass: "",
      confirmPass: ""
    })
  }

  const handleChangePassword = async() => {
    try{
      setLoading(true)
      await changePasswordUserById(auth.userData.id, form)
      setVisibleModal(false)
    } catch(error){
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <CDropdown variant="nav-item">
      { renderModal() }
      { renderModalLogout() }
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0 d-flex align-items-center" caret={false}>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            border: '1px solid black',
            height: '30px',
            width: '30px',
            borderRadius: '100%',
          }}
        >
          <CIcon icon={cilUser} />
        </div>
        <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '', marginTop: '0px'}}>{name === 'Danur SiPalingGhanzzz' ? 'Danur' : name}</span>
          <span style={{ fontSize: '10px', marginTop: '0px' }}>{roleName?.toUpperCase()}</span>
        </CNavLink>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        
        <CDropdownDivider />
        <CDropdownItem style={{ cursor: "pointer", textDecoration: "none"}} onClick={handleShowModal}>
          <CIcon icon={cilLockUnlocked} className="me-2" />
          Change Password 
        </CDropdownItem>
        <CDropdownItem style={{ cursor: "pointer", textDecoration: "none"}} onClick={()=>setVisibleModalLogout(true)}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout  
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
