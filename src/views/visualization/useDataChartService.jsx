/* eslint-disable prettier/prettier */

const useDataChartService = () => {

    const createDataChartOptions = (materialData, setupData, monitoringData) => {
        const dataFromMaterial = materialData.map((material, index)=>{
            return {
                textTitle: material.andon_display,
                xAxisCategory: material.material_no,
                yAxisTitle: material.uom,
            }
        })

        const dataFromSetup = setupData.map((setup, index)=>{
            return{
                yAxisMax: Math.round(setup.total + 500) ,
                yAxisPlotBandsFrom: 
                    {
                        green: Math.round(setup.standard_supply),
                        yellow: Math.round(setup.critical_stock + 500),
                        red: 0
                    }
                ,
                yAxisPlotBandsTo: 
                    {
                        green: Math.round(setup.total + 500), 
                        yellow: Math.round(setup.total),
                        red: Math.round(setup.standard_supply)
                    }
                ,
                yAxisSeries: 
                    {
                        name: setup.supply_line,
                        data: {
                            green: Math.round(setup.total),
                            yellow: Math.round(setup.standard_supply),
                            red: Math.round(setup.critical_stock)
                        }
                    }
            }
        })

        const dataFromMonitoring = monitoringData.map((monitoring, index)=>{
            return{
                visualization_name: monitoring.visualization_name
            }
        })
        

        const mergedData = dataFromMaterial.map((material, index) => {
            const setup = dataFromSetup[index];                
            const monitoring = dataFromMonitoring[index]
            // console.log("MergedData setup :", dataFromSetup[index])
            return {
                ...material, 
                ...setup,   
                ...monitoring
            };
        });
    
          return mergedData
    }


    const applyDataChartOptions = (dataChartOptions) => { 
        const applyData = dataChartOptions.map((option, index)=>{
          // const yAxisMax = (Math.round(option.yAxisMax * 100) / 100 )
          const yAxisMax = option.yAxisMax
          // console.log("yAxisMax for  ", option.textTitle, "is ", yAxisMax)
            
          return{
                visualization_name: option.visualization_name,
                material_name: option.textTitle,
                background_color: option.yAxisSeries.data.green > option.yAxisSeries.data.yellow ? "#004C4E"  : option.yAxisSeries.data.green <= option.yAxisSeries.data.red ? "#6B2000" : option.yAxisSeries.data.green <= option.yAxisSeries.data.yellow && option.yAxisSeries.data.green > option.yAxisSeries.data.red ? "#663E00" : "",
                isSupplyTime: option.yAxisSeries.data.green !== 0 ? option.yAxisSeries.data.red < option.yAxisSeries.data.green && option.yAxisSeries.data.green < option.yAxisSeries.data.yellow : false,
                isCriticalTime: option.yAxisSeries.data.green !== 0 ? option.yAxisSeries.data.green < option.yAxisSeries.data.red : false, 
                legend: {enabled: false},
                chart: {
                    lang: {
                      thousandsSep: ','
                    },
                    type: 'column',
                    height: (9 / 18 * 100) + '%',
                    backgroundColor: option.yAxisSeries.data.green > option.yAxisSeries.data.yellow ? "#004C4E"  : option.yAxisSeries.data.green <= option.yAxisSeries.data.red ? "#6B2000" : option.yAxisSeries.data.green <= option.yAxisSeries.data.yellow && option.yAxisSeries.data.green > option.yAxisSeries.data.red ? "#663E00" : "",
                    style: {
                        color: 'white'
                    }
                },
                title: {
                    // text: option.textTitle,
                    text: option.xAxisCategory,
                    style: {
                        color: 'white',
                        fontSize: 12,
                        // align: 'center'
                    }
                },
                xAxis: {
                    type: 'line',
                    lineColor: 'white',
                    labels: {
                        style: {
                            color: 'white'
                        }
                    },
                    categories: ['', '', '']
                },
                yAxis: {
                    min: 0,
                    minorTickInterval: 0,
                    tickColor: 'white',
                    tickLength: 10,
                    tickPixelInterval: 60,
                    minorGridLineWidth: 0,
                    lineColor: 'white',
                        gridLineColor: 'white',
                        tickPositions: [0, option.yAxisSeries.data.red, option.yAxisSeries.data.yellow, option.yAxisSeries.data.green, yAxisMax],
                    tickWidth: 1,
                    lineWidth: 1,
                    labels: {
                        distance: 10,
                        style: {
                        color: 'white',
                        },
                    },
                    max: yAxisMax,
                    title: {
                        text: option.yAxisTitle,
                        style: {
                            fontSize: '20px',
                            color: 'white'
                        }
                    },
                    plotLines: [
                        {
                            value: option.yAxisSeries.data.yellow, // The y value for the grid line
                            color: '#FBA21B', 
                            width: 1, 
                            dashStyle: 'Dash', 
                            label: { 
                                text: 'Minimum', 
                                align: 'left', 
                                x: 10, 
                                style: {
                                    color: '#EAC670',
                                    fontWeight: 'regular'
                                }
                            }
                        },
                        {
                            value: option.yAxisSeries.data.red, // Another y value for the grid line
                            color: '#D6531C',
                            width: 1,
                            dashStyle: 'Dash',
                            label: {
                                text: 'Critical',
                                align: 'left',
                                y: 14,
                                x: 10,
                                style: {
                                    color: '#DD6F4F',
                                    fontWeight: 'regular'
                                }
                            }
                        }
                    ]
                },
                series: [
                    {
                      // dataLabels: {
                      //   format: '{y:.0f}'
                      // },
                      type: 'column',
                      name: option.yAxisSeries.name,
                      data: [
                        {
                          y: 0,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                        {
                          y: option.yAxisSeries.data.green,
                          dataLabels: {
                            enabled: true,
                            borderWidth: 0,
                            style: {
                              fontSize: '2.5em',
                              textOutline : option.yAxisSeries.data.green > option.yAxisSeries.data.yellow ? "#31A093"  : option.yAxisSeries.data.green < option.yAxisSeries.data.red ? "#DD6F4F" : option.yAxisSeries.data.green <= option.yAxisSeries.data.yellow && option.yAxisSeries.data.green > option.yAxisSeries.data.red ? "#EAC670" : "",
                              color: 'white',
                              backgroundColor: '#4FD7CD',
                              borderWidth: '10px',
                              
                            },
                          },
                          tooltip: {
                            valueSuffix: option.yAxisTitle,
                          },
                          color: option.yAxisSeries.data.green > option.yAxisSeries.data.yellow ? "#4FD7CD"  : option.yAxisSeries.data.green < option.yAxisSeries.data.red ? "#D6531C" : option.yAxisSeries.data.green <= option.yAxisSeries.data.yellow && option.yAxisSeries.data.green > option.yAxisSeries.data.red ? "#FBA21B" : "",
                        },
                        {
                          y: 0,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                      ],
                    },
                    {
                      name: 'Supply Time',
                      type: 'line',
                      color: '#FBA21B',
                      data: [
                        {
                          y: option.yAxisSeries.data.yellow,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                        {
                          y: option.yAxisSeries.data.yellow,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                        {
                          y: option.yAxisSeries.data.yellow,
                          dataLabels: {
                            enabled: false,
                            borderWidth: 0,
                            style: {
                              fontSize: '1em',
                              color: '#FBA21B',
                            },
                          },
                          tooltip: {
                            valueSuffix: option.yAxisTitle,
                          },
                        },
                      ],
                    },
                    {
                      name: 'Critical',
                      type: 'line',
                      color: '#D6531C',
                      data: [
                        {
                          y: option.yAxisSeries.data.red,
                          dataLabels: {
                            enabled: false,
                            borderWidth: 0,
                            style: {
                              fontSize: '1em',
                              color: '#D6531C',
                            },
                          },
                          tooltip: {
                            valueSuffix: option.yAxisTitle,
                          },
                        },
                        {
                          y: option.yAxisSeries.data.red,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                        {
                          y: option.yAxisSeries.data.red,
                          dataLabels: {
                            enabled: false,
                          },
                        },
                      ],
                    },
                  ]

            }
        })

          return applyData;
    }

    return{
        createDataChartOptions,
        applyDataChartOptions
    }
}

export default useDataChartService