import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilLaptop, cilHistory, cilMonitor, cilAccountLogout } from '@coreui/icons'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'ANDON VISUALIZATION',
  },
  {
    component: CNavGroup,
    name: 'Master Maintenance',
    to: '/master',
    icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Master Material',
        to: '/master/material',
      },
      {
        component: CNavItem,
        name: 'Master Gentani',
        to: '/master/gentani',
      },
      {
        component: CNavItem,
        name: 'Master Setup',
        to: '/master/setup',
      },
      {
        component: CNavItem,
        name: 'Master Supply Qty',
        to: '/master/supply-qty',
      },
      {
        component: CNavItem,
        name: 'Master Monitoring',
        to: '/master/monitoring',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'History',
    to: '/history',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Consumption History',
        to: '/history/consumption',
      },
      {
        component: CNavItem,
        name: 'Supply History',
        to: '/history/supply',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Screen Monitoring',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Visualization',
        to: '/visualization',
      },
      // {
      //   component: CNavItem,
      //   name: 'Visualization 1',
      //   to: '/visualization/1',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Visualization 2',
      //   to: '/visualization/2',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Visualization 3',
      //   to: '/visualization/3',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Visualization 4',
      //   to: '/visualization/4',
      // },
    ],
  },
  // {
  //   component: CNavTitle,
  //   name: 'USER',
  // },
  // {
  //   component: CNavItem,
  //   icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  //   name: 'Logout',
  //   to: '/login',
  // },
]

export default _nav
