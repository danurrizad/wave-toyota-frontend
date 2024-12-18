/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
import React from 'react'
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
  CNavItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const ResetPassword = () => {
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
                    <h1>Reset Password</h1>
                    <p className="text-body-secondary">Reset your password account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" />
                  </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton className="px-4 btn-reset">
                          Send email
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
                  <p className="text-body-secondary d-flex justify-content-center align-items-center">Back to login? <CButton color='link' href="/#/login">Login here</CButton></p>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ResetPassword
