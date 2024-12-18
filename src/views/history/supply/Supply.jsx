/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react'
import { 
    CTable, 
    CTableHead, 
    CTableBody, 
    CTableRow, 
    CTableHeaderCell, 
    CTableDataCell, 
    CRow, 
    CCol, 
    CInputGroup, 
    CInputGroupText, 
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem, 
    CFormLabel,
    CContainer,
    CButton,
    CPagination,
    CPaginationItem,
    CFormText,
  } from '@coreui/react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, isWithinInterval, format } from "date-fns";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import useHistoryDataService from '../../../services/HistoryDataService';
import useMaterialDataService from './../../../services/MaterialDataService';

const Supply = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const { getSupplyHistory } = useHistoryDataService()
  const { getMaterialData } = useMaterialDataService()
  const [supplyHistoryData, setSupplyHistoryData] = useState([])
  const [materialData, setMaterialData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const getSupplyHistoryData = async() => {
    try {
        const response = await getSupplyHistory()
        setSupplyHistoryData(response.data.data)
        setFilteredData(response.data.data)
    } catch (error) {
        console.log("Error fetching supply history :", error)
    }
  }

  const getMaterial = async() => {
    try {
        const response = await getMaterialData('material')
        setMaterialData(response.data)
    } catch (error) {
        console.log("Error fetching material :", error)
    }
  }

  useEffect(()=>{
    getSupplyHistoryData()
    getMaterial()
  }, [])

  const [itemPerPage, setItemPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [searchQuery, setSearchQuery] = useState({
    material_no: "",
    material_desc: "",
    period_from: "",
    period_to: "",
    // plant: "All"
  })

  const handleSearch = () => {
    const { material_no, period_from, period_to } = searchQuery;
  
    const filtered = supplyHistoryData.filter((supply) => {
      const matchesNo = supply.material_no.toLowerCase().includes(material_no.toLowerCase());
    //   const matchesPlant = plant === "All" || supply.plant.toLowerCase().includes(plant.toLowerCase());
  
      // Parse the consumption_date and filter by date range
      const supplyDate = parseISO(supply.supply_date);
      const fromDate = period_from ? new Date(period_from) : null;
      const toDate = period_to ? new Date(period_to) : null;
  
      const withinDateRange =
        (!fromDate || supplyDate >= fromDate) &&
        (!toDate || supplyDate <= toDate);
  
      return matchesNo && withinDateRange;
    });
  
    setFilteredData(filtered);
    setTotalPage(Math.ceil(filtered.length / itemPerPage));
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery({ material_no: "", material_desc: ""})
    setFilteredData(supplyHistoryData)
    setTotalPage(Math.ceil(supplyHistoryData.length / itemPerPage))
    setCurrentPage(1)
  }

  const handleSetItemPerPage = (item) => {
    setItemPerPage(item)
    setCurrentPage(1)
  }

  useEffect(()=>{
    setTotalPage(Math.ceil(filteredData.length / itemPerPage))
  }, [filteredData, itemPerPage])

  const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)

  const handlePeriodChange = (from, to) => {
    setSearchQuery((prev) => ({
        ...prev,
        period_from: from ? format(from, "yyyy-MM-dd") : "",
        period_to: to ? format(to, "yyyy-MM-dd") : "",
    }));
    };
    
    const handleDownload = (data) => {
        const dateData = data.map((data)=>{
            const date = new Date(data.supply_date).toISOString().split('T')[0];
            return date
        })

        const timeData = data.map((data)=>{
            const dateString = new Date(data.supply_time)
            const timeWIB = dateString.setMinutes(dateString.getMinutes())
            const time = new Date(timeWIB).toISOString().split('T')[1].split('.')[0]

            return time
        })

        const table = Object.keys(data).map((key) => ({
            no: Number(key)+1,
            material_no: data[key].material_no,
            material_desc: data[key].material_desc,
            supply_date: dateData[key],
            supply_time: timeData[key],
        }));
        
        // 2. Convert the filtered data into a worksheet
        const worksheet = XLSX.utils.json_to_sheet(table);
        
        // 3. Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredTable");
        
        // 4. Generate a binary string representation of the workbook
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        
        // 5. Create a Blob and save the file
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `Supply History Table.xlsx`);
    };

  return (
    <>
        <CContainer fluid >
        <CRow>
            <CCol xl={4} xs={12}>
                <CRow className=''>
                    <CFormLabel htmlFor="plant" className='col-form-label col-xl-2 col-md-2 col-3' >Material</CFormLabel>
                    <CCol className="d-flex align-items-center justify-content-start gap-2 col-xl-9 col-9 col-md-10">
                        <CDropdown className='w-100 d-flex justify-content-between'>
                            <CDropdownToggle className='d-flex align-items-center justify-content-between dropdown-toggle '>{searchQuery.material_no !== "" ? (`${searchQuery.material_no} - ${searchQuery.material_desc}`) : "Select" }</CDropdownToggle>
                                <CDropdownMenu>
                                    {materialData.map((material, index)=>{
                                        return(
                                            <CDropdownItem className="cursor-pointer" key={index} onClick={()=>setSearchQuery({...searchQuery, material_no: material.material_no, material_desc: material.material_desc})}>{material.material_no} - {material.material_desc}</CDropdownItem>
                                        )
                                    })}
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                </CRow>
            </CCol>
            <CCol xl={8} xs={12}>
                <CRow className='mb-3'>
                    <CCol xl={1} xs={12}>
                        <CFormLabel className="col-xs-2 col-form-label">Period<span style={{color: "red"}}>*</span></CFormLabel>
                    </CCol>
                    <CCol xl={3} xs={12} md={5} className='d-flex gap-1'>
                        <CFormLabel htmlFor="from" className="col-3 col-xl-2 col-md-5 col-form-label ">From</CFormLabel>
                        <DatePicker
                            className='w-75'
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                handlePeriodChange(date, toDate);
                            }}
                            />
                    </CCol>
                
                    <CCol xl={5} xs={12} md={5} className='d-flex gap-1 mt-3 mt-xl-0 mt-md-0'>
                        <CFormLabel htmlFor="to" className="col-3 col-md-2 col-xl-1 col-form-label">To</CFormLabel>
                        <DatePicker
                            className='w-75'
                            selected={toDate}
                            onChange={(date) => {
                                setToDate(date);
                                handlePeriodChange(startDate, date);
                            }}
                            />
                    </CCol>
                    <CCol xl={3} xs={12} md={2}>
                        <CRow className='mb-xl-3 mb-md-3 mb-0 mt-xl-0 mt-md-0 mt-3'>
                            <CCol className="d-flex justify-content-end gap-2 col-sm-2 col-xl-12 col-md-12">
                                <CButton className='btn-search' onClick={()=>handleSearch()}>Search</CButton>
                                <CButton color="secondary" onClick={()=>handleClearSearch()}>Clear</CButton>
                            </CCol >
                        </CRow>
                    </CCol>
                </CRow>
            </CCol>
           
        </CRow>
        <CCol className='pt-4 d-flex gap-2'>
            <CButton className="btn-download" onClick={()=>handleDownload(supplyHistoryData)}>Download All</CButton>
            <CButton className="btn-download" onClick={()=>handleDownload(paginatedData)}>Download Filtered</CButton>
        </CCol>
            <CRow>
                <CCol className='py-4 text-table-small'>
                    <CTable bordered striped>
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col" className='text-center'>No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Supply By</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Supply Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Supply Time</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((supply, index) => {
                            const time = new Date(supply.supply_time).toISOString().split('T')[1].split('.')[0]
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>{index+1}</CTableDataCell>
                                        <CTableDataCell>{supply.material_no}</CTableDataCell>
                                        <CTableDataCell>{supply.material_desc}</CTableDataCell>
                                        <CTableDataCell>{supply.supply_by}</CTableDataCell>
                                        <CTableDataCell>{supply.supply_date}</CTableDataCell>
                                        <CTableDataCell>{time}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                    {paginatedData.length === 0 && <h2 className='text-center py-4'>No supply history</h2>}
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={8} xl={6} className='d-flex align-items-end'>
                    <CFormLabel>Showing {totalPage === 0 ? "0" : currentPage} to {totalPage} of {paginatedData?.length} row(s)</CFormLabel>
                </CCol>
                <CCol xs={4} xl={6} className='d-flex align-items-center justify-content-end gap-4'>
                    <CFormLabel htmlFor="size" className='col-form-label' >Size</CFormLabel>
                    <CDropdown>
                        <CDropdownToggle color="white">{itemPerPage}</CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem onClick={() => handleSetItemPerPage(10)}>10</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(25)}>25</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(50)}>50</CDropdownItem>
                            <CDropdownItem onClick={() => handleSetItemPerPage(100)}>100</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
                <CCol sm={12} xl={12} className='d-flex align-items-center gap-4 justify-content-center flex-column flex-xl-row py-4'>
                        {/* Custom Pagination Component */}
                        <CPagination className="justify-content-center">
                        {/* Previous Button */}
                        <CPaginationItem
                            disabled={currentPage === 1 || filteredData.length === 0}
                            onClick={() => currentPage > 1 && setCurrentPage(1)}
                        >
                            First
                        </CPaginationItem>
                        <CPaginationItem
                            disabled={currentPage === 1 || filteredData.length === 0}
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </CPaginationItem>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPage }, (_, i) => i + 1)
                            .slice(
                            Math.max(0, currentPage - 2), // Start index for slicing
                            Math.min(totalPage, currentPage + 1) // End index for slicing
                            )
                            .map((page) => (
                            <CPaginationItem
                                key={page}
                                active={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </CPaginationItem>
                            ))}

                        {/* Next Button */}
                        <CPaginationItem
                            disabled={currentPage === totalPage || filteredData.length === 0}
                            onClick={() => currentPage < totalPage && setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </CPaginationItem>
                        <CPaginationItem
                            disabled={currentPage === totalPage || filteredData.length === 0}
                            onClick={() => currentPage < totalPage && setCurrentPage(totalPage)}
                        >
                            Last
                        </CPaginationItem>
                    </CPagination>
                </CCol>
            </CRow>
        </CContainer>
    </>
  )
}

export default Supply