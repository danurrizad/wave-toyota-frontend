import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Master
const MasterMaterial = React.lazy(() => import('./views/master/material/Material'))
const MasterGentani = React.lazy(() => import('./views/master/gentani/Gentani'))
const MasterSetup = React.lazy(() => import('./views/master/setup/Setup'))
const MasterSupplyQty = React.lazy(() => import('./views/master/supplyQty/Supply'))
const MasterMonitoring = React.lazy(() => import('./views/master/monitoring/Monitoring'))

//History
const HistoryConsumption = React.lazy(() => import('./views/history/consumption/Consumption'))
const HistorySupply = React.lazy(() => import('./views/history/supply/Supply'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/master/material', name: 'Master Material', element: MasterMaterial },
  { path: '/master/gentani', name: 'Master Gentai', element: MasterGentani },
  { path: '/master/setup', name: 'Master Setup', element: MasterSetup },
  { path: '/master/supply-qty', name: 'Master Supply Qty', element: MasterSupplyQty },
  { path: '/master/monitoring', name: 'Master Monitoring', element: MasterMonitoring },

  { path: '/history/consumption', name: 'History Consumption', element: HistoryConsumption },
  { path: '/history/supply', name: 'History Supply', element: HistorySupply },
]

export default routes
