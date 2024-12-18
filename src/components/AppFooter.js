import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Andon Visualisation
        </a>
        <span className="ms-1">&copy; 2024 Toyota Motor Manufacturing Indonesia</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
