/* eslint-disable prettier/prettier */
import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

import { ToastProvider } from './utils/context/toastContext'
// import { AuthProvider } from './utils/context/authContext'
import AuthProvider from './utils/context/authContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
import PrivateRoutes from './components/PrivateRoutes'


// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ResetPassword = React.lazy(() => import('./views/pages/resetPass/ResetPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const Visualization = React.lazy(() => import('./views/visualization/page/Visualization'))
const Supplier = React.lazy(()=> import('./views/pages/supplier/Supplier'))
// const Visualization1 = React.lazy(() => import('./views/visualization/1/Visualization1'))
// const Visualization2 = React.lazy(() => import('./views/visualization/2/Visualization2'))
// const Visualization3 = React.lazy(() => import('./views/visualization/3/Visualization3'))
// const Visualization4 = React.lazy(() => import('./views/visualization/4/Visualization4'))
const App = () => {
  // const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  // const storedTheme = useSelector((state) => state.theme)

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  //   const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
  //   if (theme) {
  //     setColorMode(theme)
  //   }

  //   if (isColorModeSet()) {
  //     return
  //   }

  //   setColorMode(storedTheme)
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
        
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/supplier" name="Supplier" element={<Supplier />} />
            <Route exact path="/reset-password" name="Reset Password" element={<ResetPassword />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route element={<PrivateRoutes/>}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
              <Route exact path="/visualization" name="Visualization" element={<Visualization />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
