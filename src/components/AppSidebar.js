/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CButtonGroup,
  CCloseButton,
  CCol,
  CHeaderText,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNavbarNav,
  CNavbarText,
  CNavGroup,
  CNavItem,
  CRow,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
} 
from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ImageLogo from '/src/assets/images/logo/app-logo.png'

import { cilAccountLogout } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
// import navigation from '../_nav'

import { useAuth } from '../utils/context/authContext'
import useNavigation from './../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const auth = useAuth()
  const navigation = useNavigation()

  const handleLogout = () =>{
    auth.logOut()
  }

  const [visibleModalLogout, setVisibleModalLogout] = useState(false)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* Start of Modal Delete */}
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
              <CButton className='btn-add-master' onClick={()=>handleLogout()}>Yes</CButton>
          </CModalFooter>
      </CModal>
      {/* End of Modal Delete */}

      <CSidebarHeader className="border-bottom">
        <CSidebarBrand href='/' className='sidebar-title' style={{textDecoration: "none", textDecorationStyle: "none"}}>
          <CImage className="sidebar-narrow" src={ImageLogo} style={{width: "24px"}}/>
          <CHeaderText className="sidebar-brand-full" >ANDON VISUALIZATION</CHeaderText>
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" src="src/assets/images/logo/app-logo.png" height={32} /> */}
          
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      <AppSidebarNav items={navigation} />
      
      <CSidebarHeader className='p-0'>
        <CSidebarNav>
          <CButtonGroup className='btn-group-logout px-3' style={{ cursor: "pointer"}} onClick={()=>setVisibleModalLogout(true)}>
            <CIcon className='icon-logout' icon={cilAccountLogout}/>
            <CButton className='btn-logout sidebar-brand-full' style={{ textDecoration: "none", border: "0"}}>Logout</CButton>
          </CButtonGroup>
        </CSidebarNav>
      </CSidebarHeader>


      {/* <AppSidebarNav items={navigation} /> */}
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
