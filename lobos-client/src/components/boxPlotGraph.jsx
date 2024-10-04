import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers  } from '@sgratzl/chartjs-chart-boxplot';
Chart.register(BoxPlotController, BoxAndWiskers);


const BoxPlotGraph = ({dataSetType}) =>{
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [currentDataset, setCurrentDataset] = useState("race")

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        function randomValues(count, min, max) {
          const delta = max - min;
          return Array.from({length: count}).map(() => Math.random() * delta + min);
        }

        const dataSets = {
          race: {
            labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
            data: [ {label: 'Republican', backgroundColor: 'rgba(255,0,0,0.5)', borderColor: 'red', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0,
              data:[randomValues(100, 60, 100),
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(100, 60, 120)]},

              {label: 'Democrat', backgroundColor:  'rgba(0,0,255,0.5)', borderColor: 'blue', borderWidth: 1, outlierColor: '#999999', padding: 5,itemRadius: 0, 
                data:[randomValues(100, 60, 100),
                randomValues(100, 0, 100),
                randomValues(100, 0, 20),
                randomValues(100, 20, 70),
                randomValues(100, 60, 120)]},

              {label: 'Independent', backgroundColor: 'rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0, data:[
                  randomValues(100, 60, 100),
                  randomValues(100, 0, 100),
                  randomValues(100, 0, 20),
                  randomValues(100, 20, 70),
                  randomValues(100, 60, 120)
                ]}
              
            ],
            title: "Support for Candidates by Racial Group"
          },
          income: {
            labels: ["<25k", "25-50k", "50-75k", "75-100k", ">100k"],
            data: [ {label: 'Republican', backgroundColor: 'rgba(255,0,0,0.5)', borderColor: 'red', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0,
              data:[randomValues(100, 60, 100),
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(100, 60, 120)]},

              {label: 'Democrat', backgroundColor:  'rgba(0,0,255,0.5)', borderColor: 'blue', borderWidth: 1, outlierColor: '#999999', padding: 5,itemRadius: 0, 
                data:[randomValues(100, 60, 100),
                randomValues(100, 0, 100),
                randomValues(100, 0, 20),
                randomValues(100, 20, 70),
                randomValues(100, 60, 120)]},

              {label: 'Independent', backgroundColor: 'rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0, data:[
                  randomValues(100, 60, 100),
                  randomValues(100, 0, 100),
                  randomValues(100, 0, 20),
                  randomValues(100, 20, 70),
                  randomValues(100, 60, 120)
                ]}
              
            ],
            title: "Support for Candidates by Income Bracket"
          },
          age: {
            labels: ["18-25", "26-30", "36-42", "43-49", "65+"],
            data: [ {label: 'Republican', backgroundColor: 'rgba(255,0,0,0.5)', borderColor: 'red', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0,
              data:[randomValues(100, 60, 100),
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(100, 60, 120)]},

              {label: 'Democrat', backgroundColor:  'rgba(0,0,255,0.5)', borderColor: 'blue', borderWidth: 1, outlierColor: '#999999', padding: 5,itemRadius: 0, 
                data:[randomValues(100, 60, 100),
                randomValues(100, 0, 100),
                randomValues(100, 0, 20),
                randomValues(100, 20, 70),
                randomValues(100, 60, 120)]},

              {label: 'Independent', backgroundColor: 'rgba(0, 255, 0, 0.5)', borderColor: 'green', borderWidth: 1, outlierColor: '#999999', padding: 5, itemRadius: 0, data:[
                  randomValues(100, 60, 100),
                  randomValues(100, 0, 100),
                  randomValues(100, 0, 20),
                  randomValues(100, 20, 70),
                  randomValues(100, 60, 120)
                ]}
              
            ],
            title: "Support for Candidates by Age Group"
          }
        };

        const { labels, data, title } = dataSets[dataSetType];

        const boxplotData = {
          labels: labels,
          datasets: data
        };

        
        const BoxPlot = new Chart(ctx, {
          type: 'boxplot',
          data: boxplotData,
          options: {
            responsive: true,
            
            scales:{
              x:{
                title:{
                  display: true,
                  text: "Ethnicity",
                  font: {
                    size: 20,
                  },
                  ticks:{
                    font:{
                      size: 18
                    },
                  },
                  color: '#000000'
                }
              },

              y:{
                title:{
                  display: true,
                  text: "Number of Votes",
                  font: {
                    size: 20,
                  },
                  ticks:{
                    font:{
                      size: 18
                    },
                    color: '#000000'
                  },
                  color: '#000000'
                },
                beginAtZero: true,
              },
            },

            plugins:{
              legend: {
                position: 'top',
                labels:{
                  font:{
                    size:16
                  }
                }
              },
              title: {
                display: true,
                text: title,
                font: {
                  size: 28, 
                  weight: 'bold',
                },
                color: '#000000'

              },
              
            }
          }
        });

        setChartInstance(BoxPlot);

        return () => {
            BoxPlot.destroy()
        }
    }, [dataSetType])

    // const updateChart = (type) => {
    //   if (!chartInstance) return;
  
    //   if (type === "race") {
    //     setCurrentDataset('race')
    //     chartInstance.data.labels = ["Asian", "Hispanic", "Black", "White", "American Indian"];
    //     chartInstance.data.datasets[0].data = [3000, 4943, 5920, 4134, 4234];
    //     chartInstance.data.datasets[1].data = [3000, 894, 590, 4234, 4234];
    //     chartInstance.data.datasets[2].data = [30, 89, 59, 42, 44];
    //     chartInstance.options.plugins.title.text = "Support for Candidates by Racial Group";
    //     chartInstance.options.scales.x.title.text = "Ethnicity"
    //   } 
    //   else if (type === "income") {
    //     setCurrentDataset('income')
    //     chartInstance.data.labels = ["<25k", "25-50k", "50-75k", "75-100k", ">100k"];
    //     chartInstance.data.datasets[0].data = [2000, 1500, 3000, 4000, 6000];
    //     chartInstance.data.datasets[1].data = [1800, 1200, 2800, 3500, 5800];
    //     chartInstance.data.datasets[2].data = [100, 90, 200, 300, 400];
    //     chartInstance.options.plugins.title.text = "Support for Candidates by Income";
    //     chartInstance.options.scales.x.title.text = "Income"
    //   }
    //   else if (type === "age"){
    //     setCurrentDataset('age')
    //     chartInstance.data.labels = ["18-25", "26-30", "36-42", "43-49", "65+"];
    //     chartInstance.data.datasets[0].data = [2300, 1400, 1000, 2000, 4000];
    //     chartInstance.data.datasets[1].data = [4300, 3200, 1800, 2500, 4800];
    //     chartInstance.data.datasets[2].data = [60, 40, 20, 360, 99];
    //     chartInstance.options.plugins.title.text = "Support for Candidates by Age";
    //     chartInstance.options.scales.x.title.text = "Age"
    //   }
  
    //   chartInstance.update();
    // };

    return (
        // <div className= "flex flex-col w-3/5 border-2 border-gray-800">
        <div className= "border-2 border-gray-800 rounded-xl shadow-xl">
          
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </div>
        
    )
}

export default BoxPlotGraph