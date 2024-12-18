/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCarousel,
  CCarouselItem,
  CImage,
  CHeaderText,
  CNavLink,
  CNavItem,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import useAuthDataService from './../../../services/AuthDataService';
import { useAuth } from '../../../utils/context/authContext'

const Login = () => {
  const { login } = useAuthDataService()
  const auth = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [ formData, setFormData ] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async(form) => {
    try {
      const response = await auth.loginAction(form)
      addToast(templateToast("Success", "Welcome!"))
      // navigate('/')
    } catch (error) {
        if(error.response){
          addToast(templateToast("Error", error.response.data.message))
        }else{
          console.log("Error :", error)
          addToast(templateToast("Error", error.message))
        }
    }
  }

  const [toast, addToast] = useState(0)
    const toaster = useRef()
    const templateToast = (type, msg) => {
        return(
            <CToast autohide={true}>
                <CToastHeader closeButton>
                    <svg
                    className="rounded me-2 bg-black"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                    >
                    <rect width="100%" height="100%" fill={`${type === 'Error' ? "#e85454" : "#29d93e"}`}></rect>
                    </svg>
                    <div className="fw-bold me-auto">{type}</div>
                    {/* <small>7 min ago</small> */}
                </CToastHeader>
                <CToastBody>{msg}</CToastBody>
            </CToast>
        )
    }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      
       {/* Toast */}
       <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      
      <CContainer>
        <CRow className="">
          <CCol xs={{ cols: 1 }} className=" d-flex justify-content-center align-items-center gap-2">
            <CImage
              className=""
              style={{ width: '30px' }}
              src="src/assets/images/logo/app-logo.png"
            />
            <h1 className="" style={{ color: '#dd5a43' }}>
              ANDON VISUALIZATION
            </h1>
          </CCol>
        </CRow>
        <CRow className="pb-4">
          <CCol>
            <h5 className="text-center">© Toyota Motor Manufacturing Indonesia</h5>
          </CCol>
        </CRow>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" onChange={(e)=>setFormData((prev)=>({ ...prev, username: e.target.value}))}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        style={{borderRight: "0"}}
                        onChange={(e)=>setFormData((prev)=>({...prev, password: e.target.value}))}
                      />
                      <CInputGroupText style={{backgroundColor: "transparent", borderLeft: "0"}}>
                        <CButton className='btn-show-password' onClick={()=>setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</CButton>
                    </CInputGroupText> 
                    </CInputGroup>
                    {/* <p className="text-body-secondary d-flex align-items-center">Forgot your password? <CButton color='link' href="/#/reset-password">Reset here</CButton></p> */}
                
                    <CRow>
                      <CCol xs={6}>
                        <CButton className="px-4 btn-login" onClick={()=>handleLogin(formData)}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-white card-login image-cover">
                <CCardBody>
                  <CCarousel controls indicators>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src="src/assets/images/login/vios.jpg"
                        alt="slide 1"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src="src/assets/images/login/etios.jpg"
                        alt="slide 2"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src="src/assets/images/login/innova.jpg"
                        alt="slide 2"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src="src/assets/images/login/yaris.jpg"
                        alt="slide 2"
                      />
                    </CCarouselItem>
                  </CCarousel>
                  {/* <p className="text-body-secondary d-flex justify-content-center align-items-center">Don't have an account? <CButton color='link' href="/#/register">Register here</CButton></p> */}
                </CCardBody>
              </CCard>
            </CCardGroup>
            <CCard>
              <CCardBody className='d-flex justify-content-center'>
                <CButton className='' href='/#/supplier'>
                  Go to Master Supply Quantity
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
