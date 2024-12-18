/* eslint-disable prettier/prettier */

// import React, {useState, useEffect} from 'react' 
// import { 
//   CCard, 
//   CCardBody, 
//   CCol, 
//   CCardHeader, 
//   CRow,
//   CCarousel,
//   CCarouselItem, 
//   CNavLink} from '@coreui/react'
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

// import { dataChart } from "../dataChart"
// import { dataChartOptions } from "../dataChartOptions"

// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';

// const Charts = () => {

//   const [dateState, setDateState] = useState(new Date())

//   const t = new Date()
//   const c = t.getHours() - 12
//   useEffect(() => {
//     setInterval(() => {
//       setDateState(new Date())
//     }, 1000)
//   }, [])

//   const random = () => Math.round(Math.random() * 100)

//   const renderCharts = () =>
//     dataChartOptions[0].map((opt, index) => (
//       <CCol xs={4} className="col-chart d-flex" key={index}>
//         <CCard xs={6} className="bg-black d-flex">
//           <CCardBody>
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

 
//   useEffect(() => {
//     console.log('Data Chart:', dataChart);
//     console.log('Chart Options:', dataChartOptions); // Optional
//   }, []);
    
  
//   return (
//     <CRow className='bg-black text-white min-vh-100'>
//       <CCol xs={4}>
//         <CCardBody xs={4}>
//           <h1 className='text-title pb-0' style={{color: "red"}}>TOYOTA</h1>
//           <hi className="text-indicator px-2">TMIIN-PLANT #1 & #2</hi>
//         </CCardBody>
//       </CCol>
//       <CCol xs={4}>
//         <CCardBody xs={4}><h1 className='text-title title'>ANDON DIRECT MATERIAL SUPPLY 1</h1></CCardBody>
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
//       <CCol xs={6} className='d-flex gap-5 box-indicator px-4 '>
//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-green'></div>
//           <h1 className='text-indicator'>Standard</h1>
//         </div>

//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-yellow'></div>
//           <h1 className='text-indicator'>Supply Time</h1>
//         </div>

//         <div className='d-flex align-items-center gap-1'>
//           <div className='box-red'></div>
//           <h1 className='text-indicator'>Critical</h1>
//         </div>
//       </CCol>
//       <CCol xs={6} className='d-flex align-items-center box-indicator justify-content-end px-4'>
//         <div className='d-flex align-items-center gap-4'>
//           <h1 className='text-indicator'>Navigation:</h1>
//             <CNavLink href='/'>Home</CNavLink>
//             <CNavLink href='/#/visualization/1' style={{textDecoration: "underline"}}>Visualization 1</CNavLink>
//             <CNavLink href='/#/visualization/2' style={{textDecoration: "underline"}}>Visualization 2</CNavLink>
//             <CNavLink href='/#/visualization/3' style={{textDecoration: "underline"}}>Visualization 3</CNavLink>
//             <CNavLink href='/#/visualization/4' style={{textDecoration: "underline"}}>Visualization 4</CNavLink>
//         </div>
//       </CCol>
//       <CCol xs={12}>
//         <Swiper
//           spaceBetween={0}
//           slidesPerView={1}
//           onSlideChange={(swiper) => console.log('slide change into: ', swiper.activeIndex)}
//           onSwiper={(swiper) => console.log(swiper)}
//           autoplay
//           pagination={{ clickable: true }}
//       scrollbar={{ draggable: true }}
//         >
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts()}</SwiperSlide>
//           <SwiperSlide className='d-flex flex-wrap'>{renderCharts()}</SwiperSlide>
//         </Swiper>
//       </CCol>

//       {/* <CCarousel controls indicators>
//         <CCarouselItem>
//           <div className="row">{renderCharts()}</div>
//         </CCarouselItem>

//         <CCarouselItem>
//           <div className="row">{renderCharts()}</div>
//         </CCarouselItem>
//       </CCarousel> */}

//       {/* CHART 1 */}
//       {/* <CCol xs={4} className='col-chart' >
//         <CCard xs={6} className='bg-black'>
//           <CCardBody >
//             <HighchartsReact  highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}

//       {/* CHART 2 */}
//       {/* <CCol xs={4} className='col-chart'>
//         <CCard xs={6} className='bg-black'>
//           <CCardBody>
//             <HighchartsReact highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}

//       {/* CHART 3 */}
//       {/* <CCol xs={4} className='col-chart'>
//         <CCard xs={6} className='bg-black'>
//           <CCardBody>
//             <HighchartsReact highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}

//       {/* CHART 4 */}
//       {/* <CCol xs={4} className='col-chart'>
//         <CCard xs={6} className='bg-black'>
//           <CCardBody>
//             <HighchartsReact highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}

//       {/* CHART 5 */}
//       {/* <CCol xs={4} className='col-chart'>
//         <CCard xs={6} className='bg-black'>
//           <CCardBody>
//             <HighchartsReact highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}

//       {/* CHART 6 */}
//       {/* <CCol xs={4} className='col-chart'>
//         <CCard xs={6} className='bg-black'>
//           <CCardBody>
//             <HighchartsReact highcharts={Highcharts} options={option} allowChartUpdate={true} constructorType = { 'chart' }/>
//           </CCardBody>
//         </CCard>
//       </CCol> */}


     
      
//     </CRow>
//   )
// }

// export default Charts
