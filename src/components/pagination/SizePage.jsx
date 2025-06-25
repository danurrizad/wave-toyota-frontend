/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */

import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormLabel } from "@coreui/react"

const SizePage = ({
    sizes = [10, 25, 50, 100],
    itemPerPage,
    setItemPerPage,
    setCurrentPage
}) => {

    const handleSetItemPerPage = (size) => {
        setItemPerPage(size)
        setCurrentPage(1)
    }

    return(
        <div>
            <CFormLabel htmlFor="size" className='col-form-label' >Size</CFormLabel>
            <CDropdown>
                <CDropdownToggle color="white">{itemPerPage}</CDropdownToggle>
                <CDropdownMenu className='cursor-pointer'>
                    {sizes.map((size, index)=>{
                        return(
                            <CDropdownItem key={index} style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(size)}>{size}</CDropdownItem>
                        )
                    })}
                </CDropdownMenu>
            </CDropdown>
        </div>
    )
}

export default SizePage