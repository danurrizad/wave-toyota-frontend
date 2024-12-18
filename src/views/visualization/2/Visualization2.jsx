/* eslint-disable prettier/prettier */
// import React, { useState, useEffect, useRef} from 'react';
// import useMaterialDataService from '../../../services/MaterialDataService';
// import useSetupDataService from '../../../services/SetupDataService';
// import useMonitoringDataService from '../../../services/MonitoringDataService';

// import warningSoundCritical from '../../../assets/sounds/warning-2.mp3';
// import warningSoundSupply from '../../../assets/sounds/warning-1.mp3';

// import useDataChartService from '../useDataChartService';

// import { 
//   CCard, 
//   CCardBody, 
//   CCol, 
//   CCardHeader, 
//   CRow,
//   CCarousel,
//   CCarouselItem, 
//   CNavLink,
//   CButton,
//   CButtonGroup} from '@coreui/react'
// import {
//   CChartBar,
//   CChartDoughnut,
//   CChartLine,
//   CChartPie,
//   CChartPolarArea,
//   CChartRadar,
// } from '@coreui/react-chartjs'
// import { DocsLink } from 'src/components'

// import Highcharts, { color } from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// // import { createDataChartOptions } from './DataChartComponent';
// // import DataChartComponent from './../dataChart';

// const Visualization2 = () => {
//   const { getMaterialData } = useMaterialDataService()
//   const { getSetupData } = useSetupDataService()  
//   const { getMonitoringData } = useMonitoringDataService()
//   const { createDataChartOptions, applyDataChartOptions} = useDataChartService()

//   const [ materialData, setMaterialData ] = useState([])
//   const [ setupData, setSetupData ] = useState([])
//   const [ option, setOption ] = useState([])
//   const [ isSupplyTime, setIsSupplyTime ] = useState({})
//   const [ isCriticalTime, setIsCriticalTime ] = useState({})
//   const [audioUnlocked, setAudioUnlocked] = useState(false);

//   const audioRefSupply = useRef(null);
//   const audioRefCritical = useRef(null);

//   const [dateState, setDateState] = useState(new Date())

//   const t = new Date()
//   const c = t.getHours() - 12
//   useEffect(() => {
//     setInterval(() => {
//       setDateState(new Date())
//     }, 1000)
//   }, [])

//   const getChartOptions = async() =>{
//     try {
//       const materialSetup = await getMaterialData('material')
//       const responseSetup = await getSetupData('setup')
//       const responseMonitoring = await getMonitoringData('monitoring')
      
//       const response = createDataChartOptions(materialSetup.data, responseSetup.data.data, responseMonitoring.data.data)
      
//       const responseApplyChart = applyDataChartOptions(response)

//       setIsSupplyTime(response.map(item=>item.isSupplyTime))
//       setIsCriticalTime(response.map(item=>item.isCriticalTime))

//       setOption(responseApplyChart)

//     } catch (error) {
//       console.log("Error fetching chart options :", error)
//     }
//   }

//   useEffect(()=>{
//     getChartOptions()
//   },[])

//   useEffect(() => {
//     setInterval(() => {
//       getChartOptions()
//     }, 10000)
//   }, [])


//   useEffect(() => {
//     if (!audioUnlocked){
//       audioRefCritical.current?.pause();
//       audioRefSupply.current?.pause();
//       return;
//     } 
    
//     const shouldPlayCritical = option.some((opt) => opt.isCriticalTime);
//     console.log("isCritical :", shouldPlayCritical)
//     if (shouldPlayCritical) {
//       audioRefCritical.current?.play().catch((err) => console.error(err));
//     } else {
//       audioRefCritical.current?.pause();
//     }

//     const shouldPlaySupply = option.some((opt) => opt.isSupplyTime);
//     console.log("isSupply :", shouldPlaySupply)
//     if (shouldPlaySupply) {
//       audioRefSupply.current?.play().catch((err) => console.error(err));
//     } else {
//       audioRefSupply.current?.pause();
//     }

//   }, [option, audioUnlocked]);
  

//   const renderCharts1 = () =>
//    option.map((opt, index) => (
//     opt.visualization_name === "Visualization 1" &&
//       <CCol xs={4} className="col-chart d-flex" key={index}>
//         <CCard xs={6} className="bg-black d-flex">
//           <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`}>
//             <HighchartsReact
//               highcharts={Highcharts}
//               options={opt}
//               allowChartUpdate={true}
//               constructorType="chart"
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>
//     ));
//   const renderCharts2 = () =>
//     option.map((opt, index) => (
//       opt.visualization_name === "Visualization 2" && 
//       <CCol xs={4} className="col-chart d-flex" key={index}>
//         <CCard xs={6} className="bg-black d-flex">
//           <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`}>
//             <HighchartsReact
//               highcharts={Highcharts}
//               options={opt}
//               allowChartUpdate={true}
//               constructorType="chart"
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>
//     ));
//   const renderCharts3 = () =>
//     option.map((opt, index) => (
//       opt.visualization_name === "Visualization 3" && 
//       <CCol xs={4} className="col-chart d-flex" key={index}>
//         <CCard xs={6} className="bg-black d-flex">
//           <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`}>
//             <HighchartsReact
//               highcharts={Highcharts}
//               options={opt}
//               allowChartUpdate={true}
//               constructorType="chart"
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>
//     ));
//   const renderCharts4 = () =>
//     option.map((opt, index) => (
//       opt.visualization_name === "Visualization 4" && 
//       <CCol xs={4} className="col-chart d-flex" key={index}>
//         <CCard xs={6} className="bg-black d-flex">
//           <CCardBody className={`${opt.isCriticalTime ? "blink-critical" : opt.isSupplyTime ? "blink-supply-time" : ""}`}>
//             <HighchartsReact
//               highcharts={Highcharts}
//               options={opt}
//               allowChartUpdate={true}
//               constructorType="chart"
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>
//     ));

  



//   return (
//     <div className='bg-black overflow-hidden vh-100'>
//     <CRow className='bg-black text-white'>
//       <CCol xs={4}>
//         <CCardBody xs={4}>
//           <h1 className='text-title'><a className='pb-0' href='/' style={{color: "red", textDecoration: "none"}}>TOYOTA</a></h1>
//           <hi className="text-indicator px-2">TMIIN-PLANT #1 & #2</hi>
//         </CCardBody>
//       </CCol>
//       <CCol xs={4}>
//         <CCardBody xs={4}><h1 className='text-title title' style={{color: "rgb(85, 191, 59)"}}>ANDON DIRECT MATERIAL SUPPLY 1</h1></CCardBody>
//       </CCol>
//       <CCol xs={4}>
//         <CCardBody xs={4}>
//           <h1 className='d-flex flex-column align-items-end text-title'>
//               <div className="text-title">
//                 {dateState.toLocaleString('en-US', {
//                   dateStyle: 'full'
//                 })} 
//               </div>
//               <div className='text-indicator'>
//                 {dateState.toLocaleString('en-US', {
//                   hour: 'numeric',
//                   minute: 'numeric',
//                   second: '2-digit',
//                   hour12: true,
//                 })}
//               </div>
//             </h1>
//         </CCardBody>
//       </CCol>
//     </CRow>
//     <CRow className='bg-black text-white'>
//       <CCol xs={6} className='d-flex gap-5 box-indicator px-4'>
//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-green'></div>
//           <h1 className='text-indicator'>Standard</h1>
//         </div>

//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-yellow'></div>
//           <h1 className='text-indicator'>To be supplied</h1>
//         </div>

//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-red'></div>
//           <h1 className='text-indicator'>Critical</h1>
//         </div>
//       </CCol>
//       <CCol xs={6} className='d-flex align-items-center justify-content-end'>
//           <div className="thumbnail hidden" id="paparazzixxx">
//           <CButtonGroup className="" onClick={()=> setAudioUnlocked(audioUnlocked ? false : true)}>
//             <CButton className={`button-sound ${audioUnlocked ? "on" : "off"}`}>
//               {audioUnlocked ? "Warning Sound : ON" : "Warning Sound : OFF"}
//             </CButton>
//           </CButtonGroup>
//           <audio ref={audioRefCritical} src={warningSoundCritical} loop></audio>
//           <audio ref={audioRefSupply} src={warningSoundSupply} loop></audio>
//         </div>
//       </CCol>
//       <CCol xs={12}>
//         <Swiper
//           spaceBetween={0}
//           slidesPerView={1}
//           onSlideChange={(swiper) => console.log('slide change into: ', swiper.activeIndex)}
//           onSwiper={(swiper) => console.log(swiper)}
//           pagination={{ clickable: true }}
//           scrollbar={{ draggable: true }}
//           // autoplay={{
//           //   delay: 5000,
//           //   disableOnInteraction: false,
//           // }}
//           navigation={true}
//           loop
//           modules={[Autoplay, Pagination, Navigation]}
//         >
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts1()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts2()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts3()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts4()}</SwiperSlide>
//         </Swiper>
//       </CCol>
//       </CRow>
//       </div>
//   )
// }

// export default Visualization2