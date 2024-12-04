import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';

const LineGraph = ({dataSetType}) =>{
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const dataSets = {
            trump: {
              labels: ["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"],
              data: [
                { label: "Indian", data: [3000, 894, 590, 4234, 4234, 2234], backgroundColor: "rgba(0, 0, 255, 0.5)", borderColor: "rgba(0, 0, 255, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 0, 255, 0.2)'}, tension: 0.5 },
                { label: "East Asian", data: [2000, 194, 790, 2454, 4234, 1234], backgroundColor: "rgba(0, 255, 0, 0.5)", borderColor: "rgba(0, 255, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 255, 0, 0.2)'}, tension: 0.5 },
                { label: "Non-Asian", data: [3000, 894, 590, 4234, 4234, 5234], backgroundColor: "rgba(255, 0, 0, 0.5)", borderColor: "rgba(255, 0, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(255, 0, 0, 0.2)'}, tension: 0.5 },

              ],
              title: "Support for Trump",
            },
            biden: {
              labels: ["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"],
              data: [
                { label: "Indian", data: [3000, 894, 590, 4234, 4234, 2234], backgroundColor: "rgba(0, 0, 255, 0.5)", borderColor: "rgba(0, 0, 255, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 0, 255, 0.2)'}, tension: 0.5 },
                { label: "East Asian", data: [2000, 194, 790, 2454, 4234, 1234], backgroundColor: "rgba(0, 255, 0, 0.5)", borderColor: "rgba(0, 255, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 255, 0, 0.2)'}, tension: 0.5 },
                { label: "Non-Asian", data: [3000, 894, 590, 4234, 4234, 5234], backgroundColor: "rgba(255, 0, 0, 0.5)", borderColor: "rgba(255, 0, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(255, 0, 0, 0.2)'}, tension: 0.5 },
              ],
              title: "Support for Biden",
            },
            jo_jorgensen: {
              labels: ["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"],
              data: [
                { label: "Indian", data: [3000, 894, 590, 4234, 4234, 2234], backgroundColor: "rgba(0, 0, 255, 0.5)", borderColor: "rgba(0, 0, 255, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 0, 255, 0.2)'}, tension: 0.5 },
                { label: "East Asian", data: [2000, 194, 790, 2454, 4234, 1234], backgroundColor: "rgba(0, 255, 0, 0.5)", borderColor: "rgba(0, 255, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(0, 255, 0, 0.2)'}, tension: 0.5 },
                { label: "Non-Asian", data: [3000, 894, 590, 4234, 4234, 5234], backgroundColor: "rgba(255, 0, 0, 0.5)", borderColor: "rgba(255, 0, 0, 1)", borderWidth: 1, fill: {target: 'origin', above: 'rgba(255, 0, 0, 0.2)'}, tension: 0.5 },
              ],
              title: "Support for Jo Jorgensen",
            }
          };

        const { labels, data, title } = dataSets[dataSetType];

        const LineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: data 
              },
              options: {
                responsive: true,
                scales: {
                  x:{
                    title:{
                      display: true,
                      text: "",
                      font: {
                        size: 20,
                      },
                      color: '#000000'
                    },
                    ticks:{
                      font:{
                        size: 18
                      }
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: '',
                      font: {
                        size: 20,
                      },
                      color: '#000000'
                    },
                    ticks:{
                      font:{
                        size: 18
                      }
                    }
                  },
                },
                plugins:{
                  legend: {
                    display: false,
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
                      weight: 'bold'
                    },
                    color: '#000000'

                  }
                }
              },
        })

        setChartInstance(LineChart);

        return () => {
            LineChart.destroy()
        }
    }, [dataSetType])

    return (
        <div className= "flex flex-col border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full" height={65}></canvas>
          </div>
        </div>
      
        
    )
}

export default LineGraph