/* eslint-disable prettier/prettier */
import React, { Suspense, useState, useEffect, createContext, useContext } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { CSpinner, CToast, CToastBody, CToastClose, CToaster, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import 'rsuite/dist/rsuite.min.css';

import AuthProvider from './utils/context/authContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
import PrivateRoutes from './components/PrivateRoutes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faInfo, faQuestionCircle, faWarning } from '@fortawesome/free-solid-svg-icons'


// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ResetPassword = React.lazy(() => import('./views/pages/resetPass/ResetPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const Visualization = React.lazy(() => import('./views/visualization/page/Visualization'))
const HomeLocation = React.lazy(()=> import('./views/pages/supplierLocation/HomeSupplier'))
const SupplierLocation = React.lazy(()=> import('./views/pages/supplierLocation/SupplierLocation'))

// Create a context for toast
const ToastContext = createContext()
export const useToast = () => useContext(ToastContext)

const App = () => {
  useEffect(()=>{
    localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
  }, [])

  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const color = {
      success: '#29d93e',
      info: '#6799FF',
      warning: '#FFBB00',
      error: '#e85454',
      failed: '#e85454',
    }[type] || '#e85454'

    setToasts((prevToasts) => [
      ...prevToasts,
      { message, type, color, id: Date.now() },
    ])
  }

  return (
    <ToastContext.Provider value={addToast}>
      <HashRouter>
        <CToaster style={{ position: "fixed", right: "50%", transform: "translateX(50%)", top: "10px"}}>
          {toasts.map(({ id, message, type, color }) => (
            <CToast
              key={id}
              autohide={true}
              color={type}
              delay={5000}
              visible={true}
            >
              <CToastBody className='text-white d-flex justify-content-between align-items-center' closeButton>
                <div className='d-flex gap-3 align-items-center'>
                  <FontAwesomeIcon icon={ type === 'danger' || type === 'error' ? faWarning : type === 'success' ? faCheckCircle : type === 'warning' ? faWarning : type === 'info' ? faInfo : faQuestionCircle} size='lg'/>   
                  {message}
                </div> 
                <div className='d-flex align-items-center gap-2'>
                  <div style={{ borderLeft: '2px solid white', height: "20px", width: "1px"}}></div>
                  <CToastClose dark style={{ color: "white", opacity: 1, boxShadow: 'none', fontSize: '10px'}}/>
                </div>
              </CToastBody>
            </CToast>
          ))}
        </CToaster>

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
              {/* <Route exact path="/supplier" name="Supplier" element={<Supplier />} /> */}
              <Route exact path="/reset-password" name="Reset Password" element={<ResetPassword />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route element={<PrivateRoutes/>}>
                <Route path="*" name="Home" element={<DefaultLayout />} />
                <Route exact path="/visualization" name="Visualization" element={<Visualization />} />
              </Route>
              <Route path="/supplier-location" name="Supply by Location" element={<HomeLocation/>}/>
              <Route path="/supplier-location/:locationName/:locationPlant" name="Supply at Location" element={<SupplierLocation/>}/>
            </Routes>
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </ToastContext.Provider>
  )
}

export default App
