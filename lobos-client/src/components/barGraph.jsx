import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';

const BarGraph = ({ dataSetType }) =>{
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [currentDataset, setCurrentDataset] = useState("race")

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const dataSets = {
          party: {
            labels: ["Parties"],
            data: [
              { label: "Republican", data: [8020], backgroundColor: "rgba(255, 0, 0, 0.5)", borderColor: "black", borderWidth: 1 },
              { label: "Democrat", data: [1890], backgroundColor: "rgba(0, 0, 255, 0.5)", borderColor: "black", borderWidth: 1  },
              { label: "Independent", data: [300], backgroundColor: "rgba(0, 255, 0, 0.5)", borderColor: "black", borderWidth: 1  }
            ],
            title: "Support for Candidates by Party",
            xTitle: "Political Party"
          },
          race: {
            labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
            data: [
              {data: [3000, 894, 590, 4234, 2456], backgroundColor: "rgba(0, 120, 255, 0.5)", borderColor: "black", borderWidth: 1 },
            ],
            title: "Distribution by Race",
            xTitle: "Ethnicity"
          },
          income: {
            labels: ["<25k", "25-50k", "50-75k", "75-100k", ">100k"],
            data: [
              { label: "Democrat", data: [1800, 1200, 2800, 3500, 5800], backgroundColor: "rgba(0, 120, 255, 0.5)", borderColor: "black", borderWidth: 1 },
            ],
            title: "Distribution by Income",
            xTitle: "Income"
          },
          age: {
            labels: ["18-25", "26-30", "36-42", "43-49", "65+"],
            data: [
              { label: "Democrat", data: [4300, 3200, 1800, 2500, 4800], backgroundColor: "rgba(0, 120, 255, 0.5)", borderColor: "black", borderWidth: 1  },
            ],
            title: "Distribution by Age",
            xTitle: "Age"
          }
        };
    
        const { labels, data, title, xTitle} = dataSets[dataSetType];

        const BarChart = new Chart(ctx, {
            type: "bar",
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
                      text: xTitle,
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
                      text: 'Number of People',
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
                    display: xTitle === "Political Party", 
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

                  }
                }
              },
        })

        setChartInstance(BarChart);

        return () => {
            BarChart.destroy()
        }
    }, [dataSetType])

    return (
        <div className= " border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full" ></canvas>
          </div>

        </div>
      
        
    )
}

export default BarGraph