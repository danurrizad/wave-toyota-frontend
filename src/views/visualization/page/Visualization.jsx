/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef} from 'react';
import useMaterialDataService from '../../../services/MaterialDataService';
import useSetupDataService from '../../../services/SetupDataService';
import useMonitoringDataService from '../../../services/MonitoringDataService';
import useDaysDataService from '../../../services/DaysDataService';
import useDataChartService from '../useDataChartService';

import warningSoundCritical from '../../../assets/sounds/warning-2.mp3';
import warningSoundSupply from '../../../assets/sounds/warning-1.mp3';


import { 
  CCardBody, 
  CCol,  
  CRow,
  CButton,
  CButtonGroup,
  CCardHeader,
  CCard,
  CFormLabel,
  CFormInput,
  CModalFooter,
  CSpinner,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CFormText,
  CToaster,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableRow
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilVolumeOff, cilVolumeHigh } from '@coreui/icons'

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ImageCar1Left from '../../../assets/images/visualization/car-1-left.png'
import ImageCar2Left from '../../../assets/images/visualization/car-2-left.png'
import ImageCar1Right from '../../../assets/images/visualization/car-1-right.png'
import ImageCar2Right from '../../../assets/images/visualization/car-2-right.png'
import { Checkbox, CheckboxGroup, DatePicker } from 'rsuite';
import templateToast from '../../../components/ToasterComponent';
import "react-datepicker/dist/react-datepicker.css";
import useScheduleDataService from '../../../services/ScheduleDataService';

const Visualization = () => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModalConfirmation, setShowModalConfirmation] = useState(false)
  const [scheduleChanged, setScheduleChanged] = useState(false)

  const { getScheduleByMonth, upsertSchedules } = useScheduleDataService()
  const { getMaterialData } = useMaterialDataService()
  const { getSetupData } = useSetupDataService()  
  const { getMonitoringData } = useMonitoringDataService()
  const { createDataChartOptions, applyDataChartOptions} = useDataChartService()

  const [ option, setOption ] = useState([])
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)

  const audioRefSupply = useRef(null);
  const audioRefCritical = useRef(null);


  function getAllDatesByMonth(dateString) {
    const dates = []
    const schedules = []
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed: January = 0
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 2; day <= daysInMonth + 1; day++) {
      const dateThis = new Date(year, month, day);
      const iso = dateThis.toISOString().split('T')[0]; // format: yyyy-mm-dd
      schedules.push({
        date: iso,
        plant1: false,
        plant2: true
      })

      // const dateOnlyString = iso.split("-")[2]
      dates.push(iso);
    }
    // setSchedulesPlant(schedules)

    return dates;
  }

  const [setupDate, setSetupDate] = useState(new Date().toLocaleDateString('en-CA', {
    month: "long",
    year: "numeric"
  }))
  const [datesByMonth, setDaysByMonth] = useState([])
  const [schedulesPlant, setSchedulesPlant] = useState([])

  useEffect(()=>{
    setDaysByMonth(getAllDatesByMonth(setupDate))
  }, [setupDate])


  const [dateState, setDateState] = useState(new Date())
  const t = new Date()
  const c = t.getHours() - 12
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date())
    }, 1000)
  }, [])

  const getChartOptions = async() =>{
    try {
      const materialSetup = await getMaterialData('material')
      const responseSetup = await getSetupData('setup', '')
      const responseMonitoring = await getMonitoringData('monitoring')
      
      const response = createDataChartOptions(materialSetup.data, responseSetup.data.data, responseMonitoring.data.data)
      
      const responseApplyChart = applyDataChartOptions(response)


      setOption(responseApplyChart)
      Highcharts.setOptions({
        lang: {
            locale: 'ar-SA'
        }
    });

    } catch (error) {
      console.log("Error fetching chart options :", error)
      addToast(templateToast("Error", error.message))
    }
  }


  useEffect(()=>{
    getChartOptions()
  },[])
  
  Highcharts.setOptions({
    lang: {
      thousandsSep: '.'
    }
  });
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      getChartOptions();
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, []);



  useEffect(() => {
    if (!audioUnlocked){
      audioRefCritical.current?.pause();
      audioRefSupply.current?.pause();
      return;
    } 
    
    const shouldPlayCritical = option.some((opt) => opt.isCriticalTime);
    if (shouldPlayCritical) {
      audioRefCritical.current?.play().catch((err) => console.error(err));
    } else {
      audioRefCritical.current?.pause();
    }

    const shouldPlaySupply = option.some((opt) => opt.isSupplyTime);
    if (shouldPlaySupply) {
      audioRefSupply.current?.play().catch((err) => console.error(err));
    } else {
      audioRefSupply.current?.pause();
    }

  }, [option, audioUnlocked]);

  useEffect(() => {
    document.title = "Andon Visualization - Charts"; // Set the document title
    return () => {
      document.title = "Andon Visualization"; // Optional: Reset the title on component unmount
    };
  }, []);

  const pagination = {
    clickable: true,
    // bulletClass: "bg-amber-400",
    // bulletActiveClass: "bg-green-400",
    // type: "bullets",
    renderBullet: function (index, className) {
      return `
        <span class="${className}" 
              style="display: flex;
                     align-items: center;
                     justify-content: center;
                     width: 40px; 
                     height: 40px; 
                     line-height: 30px; 
                     text-align: center; 
                     font-size: 12px; 
                     color: black; 
                     opacity: 1; 
                     background-color: black; 
                     border-radius: 50%; 
                     margin: 5px;
                     cursor: pointer;">
          ${index + 1}
        </span>`;
    },
  }

  

  const renderCharts1 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 1" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));
  
    const renderCharts2 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 2" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));
    
    const renderCharts3 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 3" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));

    const renderCharts4 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 4" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));
    
    const renderCharts5 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 5" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));

    const renderCharts6 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 6" &&
      <CCol xl={4} md={12} xs={12} className="border-0 pb-4 px-4" key={index}>
        <CCard style={{ backgroundColor: 'transparent', border: '1px solid gray', overflow: 'hidden'}}>
          <CCardHeader className='p-0 py-1' style={{ backgroundColor: opt.background_color}}>
            <h6 className={`text-center text-white`}>{opt.material_name}</h6>
          </CCardHeader>
          <CCardBody className={`overflow-hidden ${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{borderTop: "1px solid gray",  borderRadius: "", padding: 0}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        </CCard>
      </CCol>
    ));


    const [currentTitle, setCurrentTitle] = useState("")
    // Map slide IDs to titles
    const slideTitles = {
      chart1: 'PLANT 1',
      chart2: 'PLANT 1',
      chart3: 'PLANT 1',
      chart4: 'PLANT 2',
      chart5: 'PLANT 2',
      chart6: 'PLANT 2',
    };

    const handleSlideChange = (swiper) => {
      const activeSlideId = swiper.slides[swiper.activeIndex]?.id;
      if (slideTitles[activeSlideId]) {
        setCurrentTitle(slideTitles[activeSlideId]);
      }
    };


    // Date Schedules
    const handleChangeSchedulePlant1 = (value, checked, event) => {
      setScheduleChanged(true)
      setSchedulesPlant(prev =>
        prev.map(item => item.date === value ? { ...item, plant1: checked } : item)
      );
    }


    const handleChangeSchedulePlant2 = (value, checked, event) => {
      setScheduleChanged(true)
      setSchedulesPlant(prev =>
        prev.map(item => item.date === value ? { ...item, plant2: checked} : item)
      );
    }

    const handleUpdateSchedules = async() => { 
      try {
        setLoading(true)
        const response = await upsertSchedules(schedulesPlant)
        console.log("Response upsert: ", response)
        if(response){
          addToast(templateToast("success", response.data.message))
          fetchScheduleByMonth()
          setShowModal(false)
          setScheduleChanged(false)
        }
      } catch (error) {
        console.error(error)
      } finally{
        setLoading(false)
      }
    }

    const fetchScheduleByMonth = async() => {
      try {
        const dateFormatted = new Date(setupDate).toLocaleDateString('en-CA').slice(0, 7)
        const response = await getScheduleByMonth(dateFormatted)
        setSchedulesPlant(response.data.data)
      } catch (error) {
        console.error(error)
        console.error(error?.response?.data?.error)
      }
    }

    useEffect(()=>{
      fetchScheduleByMonth()
    }, [setupDate])

  return (
    <div className='bg-andon overflow-x-hidden'>

      {/* Toast */}
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      
        <img className='bg-car left' src={activeIndex === 0 || activeIndex === 1 ? ImageCar1Left : ImageCar2Left}/>
        <img className='bg-car right' src={activeIndex === 0 || activeIndex === 1 ? ImageCar1Right : ImageCar2Right}/>
  
      <CRow className='p-4 text-white'>
        <CCol xs={{ order: 1}} xl={{ order: 0 }}  className='col-6 col-xl-3'>
          <h4 className='text-section' style={{color: "#FF1F1F"}}>TOYOTA</h4>
          <CCardBody xs={4}>
            <div className='d-flex flex-column align-items-start' style={{color: "white"}}>
                <h6 className="text-section">
                  {dateState.toLocaleString('en-US', {
                    dateStyle: 'full'
                  })} 
                </h6>
                <h6 className='text-section'>
                  {dateState.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: '2-digit',
                    hour12: true,
                  })}
                </h6>
              </div>
          </CCardBody>
          <CCol className='d-flex align-items-center justify-content-start gap-2 pt-4'>
            <span style={{ display: 'none' }} data-dev="DRYAND" />
            <h6 style={{color: "white"}} className='text-section'>WARNING SOUND :</h6>
            <div className="hidden thumbnail" id="paparazzixxx">
              <CButtonGroup className="" onClick={()=> setAudioUnlocked(audioUnlocked ? false : true)} style={{border: 0}}>
                <CButton className={`button-sound ${audioUnlocked ? "on" : "off"}`}>
                  {audioUnlocked ? (
                    <div><CIcon color='green' icon={cilVolumeHigh}/></div>
                  ) : (
                    <div><CIcon color='red' icon={cilVolumeOff}/></div>
                  )}
                </CButton>
              </CButtonGroup>
              <audio ref={audioRefCritical} src={warningSoundCritical} loop></audio>
              <audio ref={audioRefSupply} src={warningSoundSupply} loop></audio>
            </div>
          </CCol>
        </CCol>
        <CCol xl={6} xs={12}>
          <CCardBody>
            <h1 className='text-center text-title' style={{color: "white"}}>ANDON DIRECT MATERIAL SUPPLY</h1>
            <h3 className='text-center text-title' style={{color: "white"}}><span style={{color: "#FF1F1F"}}>TMMIN</span> {currentTitle === "PLANT 1" ? <span style={{color: "#ADFFF9"}}>{currentTitle}</span> : <span style={{color: "#FCAA37"}}>{currentTitle}</span>}</h3>
          </CCardBody>
        </CCol>
        <CCol xl={{order:0}} xs={{order: 2}} className='col-6 col-xl-3'>
          <CCardBody>
            <CCol className='d-flex flex-column align-items-end justify-content-end gap-2' >
              <div className='d-flex align-items-center gap-2'>
                <h6 className='text-section' style={{color: "#4FD7CD"}}>STANDARD</h6>
                <div className='box-green'></div>
              </div>

              <div className='d-flex align-items-center gap-2'>
                <h6 className='text-section' style={{color: "#FBA21B"}}>TO BE SUPPLIED</h6>
                <div className='box-yellow'></div>
              </div>

              <div className='d-flex align-items-center gap-2'>
                <h6 className='text-section' style={{color: "#D6531C"}}>CRITICAL</h6>
                <div className='box-red'></div>
              </div>

              
            </CCol>
            <CCol className='d-flex justify-content-end mt-3'>
              <CButton onClick={()=>setShowModal(true)} style={{ backgroundColor:"rgb(51, 68, 116)"}} className='text-white btn-sm'>
                Consumption Setup
              </CButton>
            </CCol>
          </CCardBody>
        </CCol>
      </CRow>
      <CRow className=''>
        <CCol xs={12}>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            pagination={pagination}
            className="mySwiper"
            scrollbar={{ draggable: true }}
            loop={true}
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{
              delay: 13000,
              disableOnInteraction: false,
            }}
            navigation={true}
          >
            {option.some(o => o.visualization_name === "Visualization 1") && (
                <SwiperSlide id='chart1' className='d-flex flex-wrap'>{renderCharts1()}</SwiperSlide>
            )}
            {option.some(o => o.visualization_name === "Visualization 2") && (
                <SwiperSlide id='chart2' className='d-flex flex-wrap'>{renderCharts2()}</SwiperSlide>
            )}
            {option.some(o => o.visualization_name === "Visualization 3") && (
                <SwiperSlide id='chart3' className='d-flex flex-wrap'>{renderCharts3()}</SwiperSlide>
            )}
            {option.some(o => o.visualization_name === "Visualization 4") && (
                <SwiperSlide id='chart4' className='d-flex flex-wrap'>{renderCharts4()}</SwiperSlide>
            )}

            {option.some(o => o.visualization_name === "Visualization 5") && (
                <SwiperSlide id='chart5' className='d-flex flex-wrap'>{renderCharts5()}</SwiperSlide>
            )}
            {option.some(o => o.visualization_name === "Visualization 6") && (
                <SwiperSlide id='chart6' className='d-flex flex-wrap'>{renderCharts6()}</SwiperSlide>
            )}
          </Swiper>
        </CCol>
      </CRow>

      {/* Start of Modal Confirmation */}
      <CModal
        scrollable
        alignment='center'
        backdrop="static"
        visible={showModalConfirmation}
        onClose={() => setShowModalConfirmation(false)}
        aria-labelledby="SetupDay"
        // style={{ zIndex: 99999}}
      >
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          You have changed the schedule, but you don&lsquo;t save it. Are you sure want to close it?
        </CModalBody>
        <CModalFooter>
          <CButton 
              color="secondary" 
              className='btn-close-red' 
              onClick={() => {
                setShowModalConfirmation(false)
                setShowModal(true)
              }} 
              >
              Back
            </CButton>
            <CButton 
              className='d-flex btn-add-master align-items-center gap-2'  
              onClick={()=>{
                setScheduleChanged(false)
                setShowModalConfirmation(false)
                setShowModal(false)
                fetchScheduleByMonth()
              }}>
                Yes, close it
            </CButton>
        </CModalFooter>
      </CModal>
      {/* End of Modal Confirmation */}

      {/* Start of Modal Consumption Setup */}
      <CModal
          scrollable
          backdrop="static"
          visible={showModal}
          onClose={() => {
            if(!scheduleChanged){
              setShowModal(false)
            }else{
              setShowModal(false)
              setShowModalConfirmation(true)
            }
          }}
          aria-labelledby="SetupDay"
          >
          <CModalHeader>
              <CModalTitle id="setupDay">Consumption Day Setup</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCard>
              <CCardHeader className='text-center text-black text-uppercase fw-bold'>
              <DatePicker 
                oneTap
                format='MMMM yyyy' 
                value={new Date(setupDate)}
                onChange={(e)=>{
                  if (e!==null){
                    setSetupDate(e.toLocaleDateString('en-CA', {
                      month: "long",
                      year: "numeric"
                    }))
                  }
                }}
              />
                {/* {setupDate} */}
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableHeaderCell>Day</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Plant 1</CTableHeaderCell>
                    <CTableHeaderCell>Plant 2</CTableHeaderCell>
                  </CTableHead>
                  <CTableBody>
                    { schedulesPlant?.map((item, index)=>{
                      const day = new Date(item.date).getDay()
                      
                      const isToday = new Date().toLocaleDateString('en-CA') === item.date.split("T")[0]
                      const isWeekend = day === 6 || day === 0
                      const dateName = new Date(item.date).toLocaleDateString('id-ID', {
                        dateStyle: "full"
                      }).split(",")[0]
                      return(
                        <CTableRow key={index} style={{ border: isToday ? "3px solid skyblue" : ""}}>
                          <CTableDataCell align='middle' style={{ color: isWeekend ? "red" : "black"}}>{dateName}</CTableDataCell>
                          <CTableDataCell align='middle' style={{ color: isWeekend ? "red" : "black"}}>{item.date.split("-")[2].slice(0, 2)}</CTableDataCell>
                          <CTableDataCell align='middle'>
                            <Checkbox 
                              value={item.date}
                              checked={item.plant1}
                              onChange={handleChangeSchedulePlant1}
                            />
                          </CTableDataCell>
                          <CTableDataCell align='middle'>
                            <Checkbox 
                              value={item.date}
                              checked={item.plant2}
                              onChange={handleChangeSchedulePlant2}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      )
                    }) }
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
              
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              className='btn-close-red' 
              onClick={() => {
                if(!scheduleChanged){
                  setShowModal(false)
                }else{
                  setShowModal(false)
                  setShowModalConfirmation(true)
                }
              }}
              >
              Close
            </CButton>
            <CButton className='d-flex btn-add-master align-items-center gap-2' disabled={loading} onClick={()=>handleUpdateSchedules()}>
                { loading && <CSpinner size="sm"/>}
                Save changes
            </CButton>
          </CModalFooter>
      </CModal>
      {/* End of Modal Consumption Setup */}
    </div>
  )
}

export default Visualization