import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers  } from '@sgratzl/chartjs-chart-boxplot';
Chart.register(BoxPlotController, BoxAndWiskers);


const BoxPlotGraph = () =>{
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [currentDataset, setCurrentDataset] = useState("race")

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        function randomValues(count, min, max) {
          const delta = max - min;
          return Array.from({length: count}).map(() => Math.random() * delta + min);
        }
        
        const boxplotData = {
          labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
          datasets: [{
            label: 'Republican',
            backgroundColor: 'rgba(255,0,0,0.5)',
            borderColor: 'red',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 5,
            itemRadius: 0,
            data: [
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(100, 60, 100),
              randomValues(40, 50, 100),
              randomValues(100, 60, 120),
              randomValues(100, 80, 100)
            ]
          }, {
            label: 'Democrat',
            backgroundColor:  'rgba(0,0,255,0.5)',
            borderColor: 'blue',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 5,
            itemRadius: 0,
            data: [
              randomValues(100, 60, 100),
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(40, 60, 120),
              randomValues(100, 20, 100),
              randomValues(100, 80, 100)
            ]
          },
          {
            label: 'Independent',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'green',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 5,
            itemRadius: 0,
            data: [
              randomValues(100, 60, 100),
              randomValues(100, 0, 100),
              randomValues(100, 0, 20),
              randomValues(100, 20, 70),
              randomValues(40, 60, 120),
              randomValues(100, 20, 100),
              randomValues(100, 80, 100)
            ]
        }

        ]
        };
        
          const BoxPlot = new Chart(ctx, {
            type: 'boxplot',
            data: boxplotData,
            options: {
              responsive: true,
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Box Plot'
              }
            }
          });

        setChartInstance(BoxPlot);

        return () => {
            BoxPlot.destroy()
        }
    }, [])

    return (
        <div className= "flex flex-col w-3/5 border-2 border-gray-800">
          <div className="border-b-2 border-gray-800">
            <button className="border-2 border-black rounded-xl p-1 pl-4 pr-4"
            onClick={() => updateChart("race")}>Race </button>
            <button className="border-2 border-black rounded-xl p-1 pl-4 pr-4"
             onClick={() => updateChart("income")}> Income </button>
             <button className="border-2 border-black rounded-xl p-1 pl-4 pr-4"
             onClick={() => updateChart("age")}> Age </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </div>
        
    )
}

export default BoxPlotGraph