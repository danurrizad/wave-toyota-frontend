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
import templateToast from '../../../components/ToasterComponent'
import ImageEtios from '../../../assets/images/login/etios.jpg'
import ImageInnova from '../../../assets/images/login/innova.jpg'
import ImageVios from '../../../assets/images/login/vios.jpg'
import ImageYaris from '../../../assets/images/login/yaris.jpg'
import ImageLogo from '../../../assets/images/logo/app-logo.png'

const Login = () => {
  const auth = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [ formData, setFormData ] = useState({
    email: "",
    password: ""
  })
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async(form) => {
    try {
      setIsLoading(true)
      await auth.loginAction(form)
      addToast(templateToast("Success", "Welcome!"))
    } catch (error) {
        if(error.response){
          addToast(templateToast("Error", error.response.data.message))
        }else{
          addToast(templateToast("Error", error.message))
        }
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    if(auth.errMsg){
      addToast(templateToast("Error", auth.errMsg))
    }
  }, [])

   

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
              src={ImageLogo}
            />
            {/* <h1 className="" style={{ color: '#dd5a43' }}> */}
            <h1 className="text-title-login" >
              <span style={{ color: 'red' }}>ANDON</span> VISUALIZATION
            </h1>
          </CCol>
        </CRow>
        <CRow className="pb-4">
          <CCol>
            <h5 className="text-center">© Toyota Motor Manufacturing Indonesia</h5>
          </CCol>
        </CRow>
        <CRow className="justify-content-center">
          <CCol md={12} xl={8} >
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
                      <CFormInput placeholder="Username" autoComplete="username" onKeyDown={(e)=>{if(e.key==="Enter") handleLogin(formData)}} onChange={(e)=>setFormData((prev)=>({ ...prev, username: e.target.value}))} />
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
                        onKeyDown={(e)=>{if(e.key==="Enter") handleLogin(formData)}}
                        onChange={(e)=>setFormData((prev)=>({...prev, password: e.target.value}))}
                      />
                      <CInputGroupText style={{backgroundColor: "transparent", borderLeft: "0"}}>
                        <CButton className='btn-show-password' onClick={()=>setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</CButton>
                    </CInputGroupText> 
                    </CInputGroup>
                    {/* <p className="text-body-secondary d-flex align-items-center">Forgot your password? <CButton color='link' href="/#/reset-password">Reset here</CButton></p> */}
                
                    <CRow>
                      <CCol xs={6}>
                        <CButton disabled={isLoading} className="px-4 btn-login d-flex align-items-center gap-2" onClick={()=>handleLogin(formData)}>
                          {isLoading && <CSpinner size='sm'/> }Login
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
                        src={ImageVios}
                        alt="slide 1"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src={ImageEtios}
                        alt="slide 2"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src={ImageInnova}
                        alt="slide 2"
                      />
                    </CCarouselItem>
                    <CCarouselItem>
                      <CImage
                        className="d-block w-100"
                        src={ImageYaris}
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
