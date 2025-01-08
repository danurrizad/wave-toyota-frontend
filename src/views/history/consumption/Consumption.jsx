/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
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
    CCard,
    CCardBody,
    CCardFooter
  } from '@coreui/react'

import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DateRangePicker } from 'rsuite'
import Select from 'react-select'

import useHistoryDataService from './../../../services/HistoryDataService';
import templateToast from '../../../components/ToasterComponent';

import { parseISO } from "date-fns";
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";

const Consumption = () => {
  const [period, setPeriod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  const [consumptionData, setConsumptionData] = useState([])
  const {getConsumptionHistory} = useHistoryDataService()
  const [totalProductionPerUnit, setTotalProductionPerUnit] = useState([])

  const getConsumption = async() => {
    try {
        setLoading(true)
        const response = await getConsumptionHistory()
        const totalUnit = calculateUnitsByUnitToday(response.data.data)
        
        setTotalProductionPerUnit(totalUnit)
        setConsumptionData(response.data.data)
        setFilteredData(response.data.data)
    } catch (error) {
        console.log("Error :", error)
        if(error.response){
            addToast(templateToast("Error", error.response.data.message))
        }
        else{
            addToast(templateToast("Error", error.message))
        }
    } finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
    getConsumption()
  }, [])

  // Function to check if a timestamp is within today's date range
    const isToday = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1);

        return date >= startOfDay && date < endOfDay;
    };

    // Function to calculate total units produced per `unit` for today
    const calculateUnitsByUnitToday = (data) => {
        const unitsCount = {};
        data.forEach((item) => {
            if (isToday(item.consumption_time)) {
                const key = `${item.consumption_time}-${item.unit}`;
                if (!unitsCount[item.unit]) {
                    unitsCount[item.unit] = new Set(); // Use Set to avoid duplicate `usedAt` values
                }
                unitsCount[item.unit].add(key);
            }
        });

        // Convert the Set size to count of unique `usedAt` per unit
        const result = {};
        for (const unit in unitsCount) {
            result[unit] = unitsCount[unit].size;
        }

        return result;
    };


  const [currentPage, setCurrentPage] = useState(1)
  const [itemPerPage, setItemPerPage] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState({
    materialDescOrNo: "",
    plant: "All",
    unit: "All"
  })

  const optionsMaterialDesc = Array.from(
    new Map(
      consumptionData.map((consumption) => [consumption.material_desc, consumption]) // Use a Map to remove duplicates by material_desc
    ).values()
  ).map((consumption) => ({
    value: consumption.material_no, // Use material_desc as the value
    label: `${consumption.material_no} - ${consumption.material_desc}`, // Combine material_no and material_desc for the label
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
    setLoading(true)
    const { materialDescOrNo, plant, unit } = searchQuery;
    const filtered = consumptionData.filter((consumption) => {
        const matchesDescorNo = consumption.material_desc.toLowerCase().includes(materialDescOrNo.toLowerCase()) || consumption.material_no.toLowerCase().includes(materialDescOrNo.toLowerCase())
        const matchesPlant = plant === "All" || consumption.plant.toLowerCase().includes(plant.toLowerCase())
        const matchesUnit = unit === "All" || consumption.unit.toLowerCase().includes(unit.toLowerCase())
        

      // Parse the consumption_date and filter by date range
      const consumptionDate = parseISO(consumption.consumption_date);
      const fromDate = period ? new Date(period[0]) : null;
      const toDate = period ? new Date(period[1]) : null;
      if(toDate !== null){
        toDate.setHours(23, 59, 59, 999)    
      }
      const withinDateRange =
        (!fromDate || consumptionDate >= fromDate) &&
        (!toDate || consumptionDate <= toDate);
      return matchesDescorNo && withinDateRange && matchesPlant && matchesUnit;
    });
    setFilteredData(filtered);
    setTotalPage(Math.ceil(filtered.length / itemPerPage));
    setCurrentPage(1);
    setLoading(false)
};
  

  const handleClearSearch = () => {
    setSearchQuery({ materialDescOrNo: "", plant: "All", unit: "All"})
    setPeriod(null)
    setFilteredData(consumptionData)
    setTotalPage(Math.ceil(consumptionData.length / itemPerPage))
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
            const date = new Date(data.consumption_date).toISOString().split('T')[0];
            return date
        })

        const timeData = data.map((data)=>{
            const dateString = new Date(data.consumption_time)
            const timeWIB = dateString.setMinutes(dateString.getMinutes() + (7 * 60))
            const time = new Date(timeWIB).toISOString().split('T')[1].split('.')[0]

            return time
        })

        const table = Object.keys(data).map((key) => ({
          no: Number(key)+1,
          material_no: data[key].material_no,
          material_desc: data[key].material_desc,
          consumption_date: dateData[key],
          consumption_time: timeData[key],
        //   katashiki: data[key].katashiki,
          initial_stock: data[key].initial_stock,
          final_stock: data[key].final_stock,
          qty: data[key].qty,
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
        const fileName = `Consumption_Export_${now.format('YYYYMMDD_HHmmss')}.xlsx`;
      
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
            <CRow className='mb-3'>
                <h3>{`Today's Unit Production Counter`}</h3>
            </CRow>
            <CRow className='pb-5'>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Fortuner ? totalProductionPerUnit.Fortuner : 0}
                            </div>
                        </CCardBody>
                        <CCardFooter>Fortuner</CCardFooter>
                    </CCard>
                </CCol>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Zenix ? totalProductionPerUnit.Zenix : 0}
                            </div>
                        </CCardBody>
                        <CCardFooter>Zenix</CCardFooter>
                    </CCard>
                </CCol>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Innova ? totalProductionPerUnit.Innova : 0}
                            </div>
                        </CCardBody>
                        <CCardFooter>Innova</CCardFooter>
                    </CCard>
                </CCol>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Avanza ? totalProductionPerUnit.Avanza : 0}
                            </div>
                        </CCardBody>
                        <CCardFooter>Avanza</CCardFooter>
                    </CCard>
                </CCol>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Yaris ? totalProductionPerUnit.Yaris : 0}
                            </div>
                        </CCardBody>
                        <CCardFooter>Yaris</CCardFooter>
                    </CCard>
                </CCol>
                <CCol lg={2} xs={4}>
                    <CCard className='text-center'>
                        <CCardBody className='d-flex justify-content-center'>
                            <div className='d-flex align-items-center justify-content-center' style={{ border: "2px solid gray", width: "50px", height: "50px", borderRadius: "100%"}}>
                                { totalProductionPerUnit.Calya ? totalProductionPerUnit.Calya : 0 }
                            </div>
                        </CCardBody>
                        <CCardFooter>Calya</CCardFooter>
                    </CCard>
                </CCol>
            </CRow>

            <CRow>
                <h3>History</h3>
            </CRow>
            <CRow >
                <CCol xl={3} md={6} sm={6} xs={12} >
                    <CRow className='mb-3'>
                        <CFormLabel htmlFor="plant" className='col-form-label col-xxl-12 col-md-12 col-3'>Material</CFormLabel>
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
                <CCol xl={2} md={6} sm={6} xs={6}>
                    <CRow className='mb-3 pt-xl-0 pt-3'>
                        <CFormLabel className="col-form-label col-sm-12 col-xxl-12">Period</CFormLabel>
                        <CCol xl={11} xs={12} md={12} sm={12} className='d-flex gap-1' >
                            <DateRangePicker 
                                placeholder="Select date period"
                                placement='bottomEnd'
                                showOneCalendar
                                preventOverflow
                                loading={loading}
                                value={period}
                                onChange={setPeriod}
                                format="MMMM dd, yyyy" 
                            />
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xl={4} md={6} sm={6} xs={6}>
                    <CRow className='mb-3 pt-xl-0 pt-3'>
                        <CFormLabel className="col-form-label col-xxl-12 col-md-12 col-sm-12 ">Unit</CFormLabel>
                        <CCol xl={8} xs={12} md={8} sm={12} className='d-flex align-items-start gap-2 '>
                            <CDropdown className='dropdown-search d-flex justify-content-between align-items-end'>
                                <CDropdownToggle  className='d-flex justify-content-between align-items-center'>{searchQuery.unit}</CDropdownToggle>
                                <CDropdownMenu className='cursor-pointer'>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "All"})}>All</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Fortuner"})}>Fortuner</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Zenix"})}>Zenix</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Innova"})}>Innova</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Avanza"})}>Avanza</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Yaris"})}>Yaris</CDropdownItem>
                                    <CDropdownItem style={{textDecoration: "none"}} onClick={()=>setSearchQuery({...searchQuery, unit: "Calya"})}>Calya</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol xl={4} xs={12} md={4} sm={12}>
                            <CRow className='mb-xl-3 mb-md-3 mb-0 mt-xl-0 mt-md-0 mt-sm-3 mt-3'>
                                <CCol className="d-flex justify-content-end gap-2 col-sm-12 col-xl-12 col-md-12">
                                    <CButton className='btn-search' onClick={()=>handleSearch()}>Search</CButton>
                                    <CButton color="secondary" onClick={()=>handleClearSearch()}>Clear</CButton>
                                </CCol >
                            </CRow>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
            <CCol className='pt-4 gap-2 d-flex'>
              <CButton className="btn-download" onClick={()=>handleDownload(consumptionData)}>Download All</CButton>
              <CButton className="btn-download" onClick={()=>handleDownload(paginatedData)}>Download Filtered</CButton>
            </CCol>
            <CRow>
                <CCol className='py-4 text-table-small overflow-x-hidden'>
                    <CTable bordered striped>
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col" className='text-center'>No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material No</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Material Desc</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Plant</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Consumption Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Consumption Time</CTableHeaderCell>
                                {/* <CTableHeaderCell scope="col">Katashiki</CTableHeaderCell> */}
                                <CTableHeaderCell scope="col">Initial Stock</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Final Stock</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        { paginatedData && paginatedData.map((consumption, index) => {
                            const dateString = new Date(consumption.consumption_time)
                            const timeWIB = dateString.setMinutes(dateString.getMinutes() + (7 * 60))

                            const date = new Date(consumption.consumption_date).toISOString().split('T')[0];
                            const time = new Date(timeWIB).toISOString().split('T')[1].split('.')[0]
                                return(
                                    <CTableRow key={index}>
                                        <CTableDataCell className='text-center'>{index + 1 + ((currentPage-1)*itemPerPage)}</CTableDataCell>
                                        <CTableDataCell>{consumption.material_no}</CTableDataCell>
                                        <CTableDataCell>{consumption.material_desc}</CTableDataCell>
                                        <CTableDataCell>{consumption.plant}</CTableDataCell>
                                        <CTableDataCell>{date}</CTableDataCell>
                                        <CTableDataCell>{time}</CTableDataCell>
                                        {/* <CTableDataCell>{consumption.katashiki}</CTableDataCell> */}
                                        <CTableDataCell>{consumption.initial_stock}</CTableDataCell>
                                        <CTableDataCell>{consumption.final_stock}</CTableDataCell>
                                        <CTableDataCell>{consumption.qty}</CTableDataCell>
                                        <CTableDataCell>{consumption.unit}</CTableDataCell>
                                    </CTableRow>
                                )
                            } )}
                        { paginatedData.length === 0 && !loading && 
                            <CTableRow color="light">
                                <CTableDataCell color="light" colSpan={10}>
                                    <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                        <CIcon icon={icon.cilFax} size='3xl'/>
                                        <p className='pt-3'>No data found!</p>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        }
                        </CTableBody>
                    </CTable>
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

export default Consumption