/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { 
    CTable, 
    CTableHead, 
    CTableBody, 
    CTableRow, 
    CTableHeaderCell, 
    CTableDataCell, 
    CRow, 
    CCol, 
    CFormLabel,
    CContainer,
    CButton,
    CSpinner,
  } from '@coreui/react'

import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import useHistoryDataService from '../../../services/HistoryDataService';
import useMaterialDataService from './../../../services/MaterialDataService';

import { DateRangePicker } from 'rsuite'
import Select from 'react-select'
import CIcon from '@coreui/icons-react';
import * as icon from "@coreui/icons";
import SizePage from '../../../components/pagination/SizePage';
import Pagination from '../../../components/pagination/Pagination';

const Supply = () => {
  const [ loading, setLoading ] = useState(false)
  const [period, setPeriod] = useState([
    new Date(),
    new Date()
  ]);

  const { getSupplyHistory } = useHistoryDataService()
  const { getMaterialData } = useMaterialDataService()
  const [supplyHistoryData, setSupplyHistoryData] = useState([])
  const [optionsMaterialDesc, setOptionsMaterialDesc] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const getSupplyHistoryData = async() => {
    try {
        setLoading(true)
        const startDate = period[0]?.toLocaleDateString('en-CA') || ""
        const endDate = period[1]?.toLocaleDateString('en-CA') || ""
        const response = await getSupplyHistory(startDate, endDate, searchQuery.plant, searchQuery.materialDescOrNo)
        setSupplyHistoryData(response.data.data)
        setFilteredData(response.data.data)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  const getMaterial = async() => {
    try {
        setLoading(true)
        const response = await getMaterialData('material')
        const options = Array.from(new Map(
                response?.data?.map(item => [
                    item.material_no,
                    {
                        label: `${item.material_no} - ${item.material_desc}`,
                        value: item.material_no
                    }
                ])
            ).values()
        );
        setOptionsMaterialDesc(options)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

    useEffect(()=>{
        getMaterial()
    }, [])


    const [itemPerPage, setItemPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [searchQuery, setSearchQuery] = useState({
        materialDescOrNo: "",
        plant: ""
    })

    useEffect(()=>{
        getSupplyHistoryData()
    }, [searchQuery, period])

  const optionsPlant = [
    { label: "P1 - PLANT 1", value: "P1 - PLANT 1" },
    { label: "P2 - PLANT 2", value: "P2 - PLANT 2" }
  ]
  

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

        <CRow>
            <CCol xl={3} sm={6} xs={12}>
                <CRow className='mb-3'>
                    <CFormLabel htmlFor="plant" className='col-form-label col-xxl-12 col-md-2 col-3' >Material</CFormLabel>
                    <CCol className="d-flex align-items-center justify-content-start gap-2 col-xxl-11 col-12 col-md-11">
                        <Select 
                            noOptionsMessage={() =>  "No material found" } 
                            options={optionsMaterialDesc} 
                            placeholder="All" 
                            isClearable 
                            value={optionsMaterialDesc.find((option) => option.value === searchQuery.materialDescOrNo) || null} 
                            onChange={(e) => setSearchQuery({ ...searchQuery, materialDescOrNo: e ? e.value : "" })} 
                            className='w-100' styles={colorStyles}/>
                    </CCol>
                </CRow>
            </CCol>
            <CCol xl={3} md={6} sm={6} xs={12} >
                <CRow className='mb-3'>
                    <CFormLabel htmlFor="plant" className='col-form-label col-sm-12 col-xxl-12' >Plant</CFormLabel>
                    <CCol className='d-flex align-items-center gap-2 col-xxl-11 col-12 col-md-12'>
                        <Select
                            options={optionsPlant}
                            value={optionsPlant.find((opt)=>opt.value === searchQuery.plant) || ""}
                            onChange={(e)=>setSearchQuery({ ...searchQuery, plant: e !== null ? e.value : ""})}
                            className='w-100'
                            styles={colorStyles}
                            isClearable
                            placeholder="All"
                        />
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
                            onChange={(e)=>{
                                setPeriod(e!==null ? e : "")
                            }}
                            format="MMMM dd, yyyy" 
                        />
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
                    <CTable bordered striped responsive>
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
                        { ( paginatedData.length > 0 && !loading ) && paginatedData.map((supply, index) => {
                            const time = new Date(supply.supply_time).toISOString().split('T')[1].split('.')[0]
                                return(
                                    <CTableRow key={index} style={{ verticalAlign: "middle" }} >
                                        <CTableDataCell className='text-center'>{index + 1 + ((currentPage-1)*itemPerPage)}</CTableDataCell>
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
                        { paginatedData.length === 0 && !loading && 
                            <CTableRow color="light">
                                <CTableDataCell color="light" colSpan={9}>
                                    <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                        <CIcon icon={icon.cilFax} size='3xl'/>
                                        <p className='pt-3'>No data found!</p>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        }
                         { loading && 
                            <CTableRow color=''>
                                <CTableDataCell colSpan={100}>
                                    <div className=' py-2 text-not-found d-flex flex-column justify-content-center align-items-center text-black' style={{ opacity: "30%"}}>
                                        <CSpinner/>
                                        <p className='pt-3'>Loading data</p>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                            }
                        </CTableBody>
                    </CTable>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={8} xl={6} className='d-flex align-items-end'>
                    <CFormLabel>Showing {totalPage === 0 ? "0" : currentPage} to {totalPage} of {paginatedData?.length} row(s)</CFormLabel>
                </CCol>
                <CCol xs={4} xl={6} className='d-flex align-items-center justify-content-end gap-4'>
                    <SizePage
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                </CCol>
                <CCol sm={12} xl={12} className='d-flex align-items-center gap-4 justify-content-center flex-column flex-xl-row py-4'>
                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        setCurrentPage={setCurrentPage}
                        data={filteredData}
                    />
                </CCol>
            </CRow>
        </CContainer>
    </>
  )
}

export default Supply