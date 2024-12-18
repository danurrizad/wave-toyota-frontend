/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { CHeader, CContainer, CHeaderBrand, CHeaderToggler, CCollapse, CHeaderNav, CNavItem, CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CForm, CFormInput, CButton, CImage, CHeaderText, CLink } from '@coreui/react'

import ImageLogo from '../../assets/images/logo/app-logo.png'

const HeaderSupplier = () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <CHeader>
          <CContainer >
            <CHeaderBrand href="#" className='d-flex gap-2 align-items-center'>
                <CImage src={ImageLogo} width={24}/>
                <CHeaderText className='' style={{fontSize: "16px", fontWeight: "bold"}}>ANDON VISUALIZATION</CHeaderText>
            </CHeaderBrand>
          </CContainer>
        </CHeader>
      </>
    )
}

export default HeaderSupplier