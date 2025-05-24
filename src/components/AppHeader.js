import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CNavbarText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'

import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { useAuth } from '../utils/context/authContext'
import AppHeaderDropdown from './header/AppHeaderDropdown'

const AppHeader = () => {
  const auth = useAuth()
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [dateState, setDateState] = useState(new Date())

  const t = new Date()
  const c = t.getHours() - 12
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date())
    }, 1000)
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
          className=""
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-auto order-2 order-md-1">
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                dateStyle: 'full',
              })}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: '2-digit',
                hourCycle: 'h24',
              })}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <li className="nav-item py-1" style={{ textDecoration: 'none', display: 'none' }}>
          <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>

        <CHeaderNav className="col col-md-auto justify-content-end order-1">
          <CNavItem className="d-flex align-items-center">
            <AppHeaderDropdown
              imgProfile={auth.imgProfile}
              name={auth.user}
              roleName={auth.userData.role_name}
            />
          </CNavItem>
        </CHeaderNav>
      </CContainer>

      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
