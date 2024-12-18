/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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

import useUsersDataService from './../../../services/UsersDataService';
// import { useToast } from '../../../components/context/toastContext'

const Login = () => {
  const { register } = useUsersDataService()
  // const addToast = useToast();
  
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: ""
  })

  const handleRegister = async(form) => {
    try {
      setLoading(true)
      // if(formData.password != formData.passwordConf){
      //   addToast(templateToast("Error", "Please make sure your password is correct!"))
      //   return
      // }
      // const response = await register(form)
      // addToast(templateToast("Success", response.data.message))
      // addToast(templateToast("Success", "Create success!"))
      navigate('/login')
    } catch (error) {
      if(error.response){
        console.log(error)
        addToast(templateToast("Error", error.response.data.message))
      } else {
        addToast(templateToast("Error", error.message))
      }
    } finally {
      setLoading(false)
    }
  }



  const [loading, setLoading] = useState(false)
  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="">
          <CCol xs={{ cols: 1 }} className=" d-flex justify-content-center align-items-center gap-2">
            <CImage
              className=""
              style={{ width: '3%' }}
              src="src/assets/images/logo/app-logo.png"
            />
            <h1 className="" style={{ color: '#dd5a43' }}>
              ANDON VISUALIZATION
            </h1>
          </CCol>
        </CRow>
        <CRow className="pb-4">
          <CCol>
            <h2 className="text-center">© Toyota Motor Manufacturing Indonesia</h2>
          </CCol>
        </CRow>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Register</h1>
                    <p className="text-body-secondary">Sign up your account</p>
                    <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autoComplete="username" onChange={(e)=>setFormData((prev)=>({...prev, username: e.target.value}))}/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" onChange={(e)=>setFormData((prev)=>({...prev, email: e.target.value}))}/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      style={{borderRight: "0"}}
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e)=>setFormData((prev)=>({...prev, password: e.target.value}))}
                    />
                    <CInputGroupText style={{backgroundColor: "transparent", borderLeft: "0"}}>
                      <CButton className='btn-show-password' onClick={()=>setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</CButton>
                    </CInputGroupText> 
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPass ? "text" : "password"}
                      placeholder="Password confirmation"
                      autoComplete="new-password"
                      onChange={(e)=>setFormData((prev)=>({...prev, passwordConf: e.target.value}))}
                    />
                  </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton disabled={loading} className=" px-10 d-flex align-items-center gap-2 btn-register" onClick={()=>handleRegister(formData)}>
                          { loading && <CSpinner className='spinner-border-sm'/>}
                           Create Account
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-white card-login ">
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
                  <p className="text-body-secondary justify-content-center d-flex align-items-center">Already have an account? <CButton color='link' href="/#/login">Login here</CButton></p>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
