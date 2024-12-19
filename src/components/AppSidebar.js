/* eslint-disable prettier/prettier */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CButtonGroup,
  CCloseButton,
  CHeaderText,
  CImage,
  CNavbarText,
  CNavItem,
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
import navigation from '../_nav'

import { useAuth } from '../utils/context/authContext'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const auth = useAuth()

  const handleLogout = () =>{
    auth.logOut()
  }

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
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand href='/'>
          <CImage className="sidebar-narrow" src={ImageLogo} style={{width: "24px"}}/>
          <CNavbarText className="sidebar-brand-full" style={{textDecoration: "none"}}>ANDON VISUALIZATION</CNavbarText>
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
      <CSidebarHeader>
        <CSidebarNav>
          <CButtonGroup className='btn-group-logout' style={{backgroundColor: "black", cursor: "pointer"}} onClick={()=>handleLogout()}>
            <CIcon className='sidebar-narrow' icon={cilAccountLogout}/>
            <CButton className='btn-logout sidebar-brand-full'>Logout</CButton>
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
