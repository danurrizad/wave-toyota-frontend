import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="text-center w-100">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#252b36f2' }}
        >
          Andon Visualisation
        </a>
        <span className="ms-1">&copy; 2024 Toyota Motor Manufacturing Indonesia</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
