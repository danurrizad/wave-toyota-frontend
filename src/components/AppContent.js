import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CCard, CCol, CContainer, CSpinner } from '@coreui/react'

// import { ToastProvider } from './context/toastContext'

// routes config
import routes from '../routes'
import PrivateRoutes from './PrivateRoutes'
import AuthProvider from '../utils/context/authContext'

const AppContent = () => {
  return (
    <CContainer className="px-4" fluid>
      <CCol xs={12}>
        <Suspense fallback={<CSpinner color="primary" />}>
          <AuthProvider>
            <Routes>
              <Route element={<PrivateRoutes />}>
                {routes.map((route, idx) => {
                  return (
                    route.element && (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        element={<route.element />}
                      />
                    )
                  )
                })}
              </Route>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Suspense>
      </CCol>
    </CContainer>
  )
}

export default React.memo(AppContent)
