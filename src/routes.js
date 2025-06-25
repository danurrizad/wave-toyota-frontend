import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Master
const MasterMaterial = React.lazy(() => import('./views/master/material/Material'))
const MasterGentani = React.lazy(() => import('./views/master/gentani/Gentani'))
const MasterSetup = React.lazy(() => import('./views/master/setup/Setup'))
const MasterSupplyQty = React.lazy(() => import('./views/master/supplyQty/Supply'))
const MasterSupplyLocation = React.lazy(
  () => import('./views/master/supplyLocation/SupplyLocation'),
)
const MasterMonitoring = React.lazy(() => import('./views/master/monitoring/Monitoring'))

// History
const HistoryConsumption = React.lazy(() => import('./views/history/consumption/Consumption'))
const HistorySupply = React.lazy(() => import('./views/history/supply/Supply'))

// Supplier
const Supplier = React.lazy(() => import('./views/pages/supplier/Supplier'))

// Superadmin
const Role = React.lazy(() => import('./views/superadmin/role/Role'))
const User = React.lazy(() => import('./views/superadmin/user/User'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/master/material', name: 'Master Material', element: MasterMaterial },
  { path: '/master/gentani', name: 'Master Gentai', element: MasterGentani },
  { path: '/master/setup', name: 'Master Setup', element: MasterSetup },
  { path: '/master/supply-qty', name: 'Master Supply Qty', element: MasterSupplyQty },
  {
    path: '/master/supply-location',
    name: 'Master Supply Location',
    element: MasterSupplyLocation,
  },
  { path: '/master/monitoring', name: 'Master Monitoring', element: MasterMonitoring },

  { path: '/history/consumption', name: 'History Consumption', element: HistoryConsumption },
  { path: '/history/supply', name: 'History Supply', element: HistorySupply },

  { path: '/supplier', name: 'Supplier Setup', element: Supplier },

  { path: '/role', name: 'Role', element: Role },
  { path: '/user', name: 'User', element: User },
]

export default routes
