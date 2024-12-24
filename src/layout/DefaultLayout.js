import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100" style={{ backgroundColor: '#F3F4F7' }}>
        <AppHeader />
        <div className="body flex-grow-1 d-flex" style={{ height: '100%' }}>
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
