/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef} from 'react';
import useMaterialDataService from '../../../services/MaterialDataService';
import useSetupDataService from '../../../services/SetupDataService';
import useMonitoringDataService from '../../../services/MonitoringDataService';
import useDataChartService from '../useDataChartService';

import warningSoundCritical from '../../../assets/sounds/warning-2.mp3';
import warningSoundSupply from '../../../assets/sounds/warning-1.mp3';


import { 
  CCard, 
  CCardBody, 
  CCol, 
  CCardHeader, 
  CRow,
  CCarousel,
  CCarouselItem, 
  CNavLink,
  CButton,
  CButtonGroup
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsLink } from 'src/components'

import CIcon from '@coreui/icons-react'
import { cilVolumeOff, cilVolumeHigh } from '@coreui/icons'

import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ImageCar1Left from '../../../assets/images/visualization/car-1-left.png'
import ImageCar2Left from '../../../assets/images/visualization/car-2-left.png'
import ImageCar1Right from '../../../assets/images/visualization/car-1-right.png'
import ImageCar2Right from '../../../assets/images/visualization/car-2-right.png'

const Visualization = () => {
  const { getMaterialData } = useMaterialDataService()
  const { getSetupData } = useSetupDataService()  
  const { getMonitoringData } = useMonitoringDataService()
  const { createDataChartOptions, applyDataChartOptions} = useDataChartService()

  const [ materialData, setMaterialData ] = useState([])
  const [ setupData, setSetupData ] = useState([])
  const [ option, setOption ] = useState([])
  const [ isSupplyTime, setIsSupplyTime ] = useState({})
  const [ isCriticalTime, setIsCriticalTime ] = useState({})
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)

  const audioRefSupply = useRef(null);
  const audioRefCritical = useRef(null);

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
      const responseSetup = await getSetupData('setup')
      const responseMonitoring = await getMonitoringData('monitoring')
      
      const response = createDataChartOptions(materialSetup.data, responseSetup.data.data, responseMonitoring.data.data)
      
      const responseApplyChart = applyDataChartOptions(response)

      setIsSupplyTime(response.map(item=>item.isSupplyTime))
      setIsCriticalTime(response.map(item=>item.isCriticalTime))

      setOption(responseApplyChart)
      Highcharts.setOptions({
        lang: {
            locale: 'ar-SA'
        }
    });

    } catch (error) {
      console.log("Error fetching chart options :", error)
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
  

  const renderCharts1 = () =>
   option.map((opt, index) => (
    opt.visualization_name === "Visualization 1" &&
      <CCol xs={4} className="col-chart d-flex px-4 py-1 border-0" key={index}>
          <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{border: "2px solid gray"}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        {/* <CCard xs={6} className="bg-transparent d-flex">
        </CCard> */}
      </CCol>
    ));
  const renderCharts2 = () =>
    option.map((opt, index) => (
      opt.visualization_name === "Visualization 2" && 
      <CCol xs={4} className="col-chart d-flex px-4 py-1 border-0" key={index}>
          <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{border: "2px solid gray"}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        {/* <CCard xs={6} className="bg-white d-flex">
        </CCard> */}
      </CCol>
    ));
  const renderCharts3 = () =>
    option.map((opt, index) => (
      opt.visualization_name === "Visualization 3" && 
      <CCol xs={4} className="col-chart d-flex px-4 py-1 border-0" key={index}>
          <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{border: "2px solid gray"}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        {/* <CCard xs={6} className="bg-white d-flex">
        </CCard> */}
      </CCol>
    ));
  const renderCharts4 = () =>
    option.map((opt, index) => (
      opt.visualization_name === "Visualization 4" && 
      <CCol xs={4} className="col-chart d-flex px-4 py-1 border-0 "  key={index}>
          <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`} style={{border: "2px solid gray"}}>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              allowChartUpdate={true}
              constructorType="chart"
            />
          </CCardBody>
        {/* <CCard xs={6} className="bg-white d-flex">
        </CCard> */}
      </CCol>
    ));

  



  return (
    <div className='bg-andon overflow-hidden vh-100'>
      
        <img className='bg-car left' src={activeIndex === 0 || activeIndex === 1 ? ImageCar1Left : ImageCar2Left}/>
        <img className='bg-car right' src={activeIndex === 0 || activeIndex === 1 ? ImageCar1Right : ImageCar2Right}/>
  
      <CRow className='text-white p-4'>
        <CCol xs={3} className=''>
          <h1 className='' style={{color: "#FF1F1F"}}>TOYOTA</h1>
          <CCardBody xs={4}>
            <div className='d-flex flex-column align-items-start ' style={{color: "white"}}>
                <h4 className="">
                  {dateState.toLocaleString('en-US', {
                    dateStyle: 'full'
                  })} 
                </h4>
                <h4 className=''>
                  {dateState.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: '2-digit',
                    hour12: true,
                  })}
                </h4>
              </div>
          </CCardBody>
          <CCol className='d-flex align-items-end justify-content-start gap-2 pt-4'>
            <h4 style={{color: "white", fontSize: "20px"}}>WARNING SOUND :</h4>
            <div className="thumbnail hidden" id="paparazzixxx">
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
        <CCol xs={6}>
          <CCardBody>
            <h1 className='text-center ' style={{color: "white"}}>ANDON DIRECT MATERIAL SUPPLY</h1>
            <h3 className='text-center' style={{color: "white"}}><span style={{color: "#FF1F1F"}}>TMMIN</span> {activeIndex === 0 || activeIndex === 1 ? <span style={{color: "#ADFFF9"}}>PLANT 1</span> : <span style={{color: "#FCAA37"}}>PLANT 2</span>}</h3>
          </CCardBody>
        </CCol>
        <CCol xs={3}>
          <CCardBody>
            <CCol className='d-flex flex-column align-items-end gap-2' >
              <div className='d-flex align-items-center gap-2'>
                <h4 className='' style={{color: "#4FD7CD"}}>STANDARD</h4>
                <div className='box-green'></div>
              </div>

              <div className='d-flex align-items-center gap-2'>
                <h4 className='' style={{color: "#FBA21B"}}>TO BE SUPPLIED</h4>
                <div className='box-yellow'></div>
              </div>

              <div className='d-flex align-items-center gap-2'>
                <h4 className='' style={{color: "#D6531C"}}>CRITICAL</h4>
                <div className='box-red'></div>
              </div>
            </CCol>
          </CCardBody>
        </CCol>
      </CRow>
      <CRow className=''>
        <CCol xs={12}>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            // onSlideChange={(swiper) => console.log('slide change into: ', swiper.activeIndex)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => console.log("swipe into :", swiper)}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{
              delay: 13000,
              disableOnInteraction: false,
            }}
            navigation={true}
            loop
            modules={[Autoplay, Pagination, Navigation]}
          >
            <SwiperSlide className='d-flex flex-wrap'>{renderCharts1()}</SwiperSlide>
            <SwiperSlide className='d-flex flex-wrap'>{renderCharts2()}</SwiperSlide>
            <SwiperSlide className='d-flex flex-wrap'>{renderCharts3()}</SwiperSlide>
            <SwiperSlide className='d-flex flex-wrap'>{renderCharts4()}</SwiperSlide>
          </Swiper>
        </CCol>
      </CRow>
    </div>
  )
}

export default Visualization