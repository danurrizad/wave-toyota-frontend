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
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem, 
    CFormLabel,
    CContainer,
    CButton,
    CPagination,
    CPaginationItem,
    CToaster,
    CSpinner,
  } from '@coreui/react'

import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import useHistoryDataService from '../../../services/HistoryDataService';
import useMaterialDataService from './../../../services/MaterialDataService';
import templateToast from '../../../components/ToasterComponent';

import { DateRangePicker } from 'rsuite'
import Select from 'react-select'

const Supply = () => {
  const [ loading, setLoading ] = useState(false)
  const [period, setPeriod] = useState(null);

  const { getSupplyHistory } = useHistoryDataService()
  const { getMaterialData } = useMaterialDataService()
  const [supplyHistoryData, setSupplyHistoryData] = useState([])
  const [materialData, setMaterialData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const getSupplyHistoryData = async() => {
    try {
        setLoading(true)
        const response = await getSupplyHistory()
        setSupplyHistoryData(response.data.data)
        setFilteredData(response.data.data)
    } catch (error) {
        if (error.response){
            addToast(templateToast("Error", error.response.message))
        }
        else{
            addToast(templateToast("Error", error.message))
        }
    } finally {
        setLoading(false)
    }
  }

  const getMaterial = async() => {
    try {
        setLoading(true)
        const response = await getMaterialData('material')
        setMaterialData(response.data)
    } catch (error) {
        if (error.response){
            addToast(templateToast("Error", error.response.message))
        }
        else{
            addToast(templateToast("Error", error.message))
        }
    } finally {
        setLoading(false)
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
    materialDescOrNo: "",
    plant: "All"
  })

  const optionsMaterialDesc = Array.from(
    new Map(
      supplyHistoryData.map((supply) => [supply.material_desc, supply]) // Use a Map to remove duplicates by material_desc
    ).values()
  ).map((supply) => ({
    value: supply.material_no, // Use material_desc as the value
    label: `${supply.material_no} - ${supply.material_desc}`, // Combine material_no and material_desc for the label
  }));
  

    const colorStyles = {
        control: (styles, { isFocused }) => ({
            ...styles,
            borderColor: isFocused ? 'black' : styles.borderColor, // Change border color when focused
            boxShadow: isFocused ? '0 0 0 0.5px black' : styles.boxShadow, // Add blue outline
            '&:hover': {
                borderColor: isFocused ? 'black' : styles.borderColor, // Keeps focus border on hover
            },
            }),
        option: (styles, { isFocused, isSelected, isDisabled  }) => ({
            ...styles,
            backgroundColor: isSelected
            ? '#808080' // Background color when the option is selected
            : isFocused
            ? '#F3F4F7' // Background color when the option is focused
            :  undefined, // Default background color
            ':active': {
                backgroundColor: !isDisabled
                ? isSelected
                    ? '#808080' // Background when selected and active
                    : '#F3F4F7' // Background when focused and active
                : undefined,
            },
        }),
    };

  const handleSearch = () => {
    const { materialDescOrNo, plant } = searchQuery;
  
    const filtered = supplyHistoryData.filter((supply) => {
      const matchesDescorNo = supply.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase()) || supply.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase());
      const matchesPlant = plant === "All" || supply?.plant?.toLowerCase().includes(plant.toLowerCase());
  
      // Parse the consumption_date and filter by date range
      const supplyDate = parseISO(supply.supply_date);
      const fromDate = period ? new Date(period[0]) : null;
      const toDate = period ? new Date(period[1]) : null;
      if(toDate !== null){
          toDate.setHours(23, 59, 59, 999)
      }
      const withinDateRange =
        (!fromDate || supplyDate >= fromDate) &&
        (!toDate || supplyDate <= toDate);
  
      return matchesDescorNo && withinDateRange && matchesPlant;
    });
  
    setFilteredData(filtered);
    setTotalPage(Math.ceil(filtered.length / itemPerPage));
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery({ materialDescOrNo: "", plant: "All"})
    setPeriod(null)
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

        // Generate a file name dynamically
        const now = dayjs();
        const fileName = `Supply_Export_${now.format('YYYYMMDD_HHmmss')}.xlsx`;
        
        // 5. Create a Blob and save the file
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, fileName);
    };

  return (
    <>
        <CContainer fluid >

        {/* Loading Spinner */}
        { loading && <div className="loading"><CSpinner /></div>}

        {/* Toast */}
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

        <CRow>
            <CCol xl={3} sm={6} xs={12}>
                <CRow className='mb-3'>
                    <CFormLabel htmlFor="plant" className='col-form-label col-xxl-12 col-md-2 col-3' >Material</CFormLabel>
                    <CCol className="d-flex align-items-center justify-content-start gap-2 col-xxl-11 col-12 col-md-11">
                        <Select noOptionsMessage={() =>  "No material found" } options={optionsMaterialDesc} placeholder="All" isClearable value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} className='w-100' styles={colorStyles}/>
                    </CCol>
                </CRow>
            </CCol>
            <CCol xl={3} md={6} sm={6} xs={12} >
                <CRow className='mb-3'>
                    <CFormLabel htmlFor="plant" className='col-form-label col-sm-12 col-xxl-12' >Plant</CFormLabel>
                    <CCol className='d-flex align-items-center gap-2 col-xxl-11 col-12 col-md-12'>
                        <CDropdown className='dropdown-search d-flex justify-content-between'>
                            <CDropdownToggle width={400} className='d-flex justify-content-between align-items-center'>{searchQuery.plant}</CDropdownToggle>
                            <CDropdownMenu className='cursor-pointer'>
                                <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, plant: "All"})}>All</CDropdownItem>
                                <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, plant: "P1 - PLANT 1"})}>P1 - Plant 1</CDropdownItem>
                                <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, plant: "P2 - PLANT 2"})}>P2 - Plant 2</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                </CRow>
            </CCol>
            <CCol xl={6} md={12} sm={12} xs={12}>
                <CRow className='mb-3 pt-xl-0 pt-3'>
                    <CFormLabel className="col-form-label col-xxl-12">Period</CFormLabel>
                    <CCol xl={8} xs={9} md={6} sm={6}>
                        <DateRangePicker 
                            placeholder="Select date period"
                            value={period}
                            onChange={setPeriod}
                            format="MMMM dd, yyyy" 
                        />
                    </CCol>
                    <CCol xl={4} md={6} sm={6} xs={12}>
                        <CRow className='mb-xl-3 mb-md-3 mb-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 mt-3'>
                            <CCol className="d-flex justify-content-end gap-2 col-sm-12 col-xl-12 col-md-12">
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
                        <CTableHead style={{ verticalAlign: "middle", textAlign: "center" }}>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col" rowSpan={2} className='text-center'>No</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2} align='left'>Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2}>Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2}>Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2}>Supply By</CTableHeaderCell>
                                <CTableHeaderCell scope="col" colSpan={2} className='text-center'>Supply Qty</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2}>Supply Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col" rowSpan={2}>Supply Time</CTableHeaderCell>
                            </CTableRow>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col">By Pack</CTableHeaderCell>
                                <CTableHeaderCell scope="col">By Uom</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((supply, index) => {
                            const time = new Date(supply.supply_time).toISOString().split('T')[1].split('.')[0]
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }} >
                                        <CTableDataCell className='text-center'>{index+1}</CTableDataCell>
                                        <CTableDataCell>{supply.material_no}</CTableDataCell>
                                        <CTableDataCell>{supply.material_desc}</CTableDataCell>
                                        <CTableDataCell>{supply.plant}</CTableDataCell>
                                        <CTableDataCell>{supply.supply_by}</CTableDataCell>
                                        <CTableDataCell>{supply.qty_pack}</CTableDataCell>
                                        <CTableDataCell>{supply.qty_uom}</CTableDataCell>
                                        <CTableDataCell>{supply.supply_date}</CTableDataCell>
                                        <CTableDataCell>{time}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        </CTableBody>
                    </CTable>
                    {paginatedData.length === 0 && !loading && <h2 className='text-center py-4'>No supply history</h2>}
                    {loading && <h2 className='text-center py-4'>...</h2>}
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
                        <CDropdownMenu className='cursor-pointer'>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(10)}>10</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(25)}>25</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(50)}>50</CDropdownItem>
                            <CDropdownItem style={{ textDecoration: "none" }} onClick={() => handleSetItemPerPage(100)}>100</CDropdownItem>
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