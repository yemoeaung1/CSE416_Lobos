import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import axios from 'axios';

const BarGraph = ({ dataSetType, selectedState }) =>{
    const chartRef = useRef(null);
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
      const fetchGraphData = async () => {
        try {
          console.log(dataSetType)
          const response = await axios.get(`http://localhost:8080/api/bar?state=${selectedState}&filter=${dataSetType}`);
          const { labels, dataSets, title, xlabel, ylabel } = response.data;
          console.log(response.data)
          console.log(xlabel)
          
          setGraphData({
            labels,
            datasets: dataSets.map((dataSet) => ({
              label: dataSet.label,
              data: dataSet.data,
              backgroundColor: dataSet.backgroundColor,
              borderColor: dataSet.borderColor,
              borderWidth: dataSet.borderWidth,
            })),
            title: title,
            xTitle: xlabel,
            yTitle: ylabel
          });
        } 
        catch (error) {
          console.error("Error fetching graph data:", error);
        }
      };
      fetchGraphData();
    }, [dataSetType, selectedState]);

    useEffect(() => {
        if (!graphData) return;


        const ctx = chartRef.current.getContext("2d");

        const BarChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: graphData.labels,
                datasets: graphData.datasets
              },
              options: {
                responsive: true,
                scales: {
                  x:{
                    title:{
                      display: true,
                      text: graphData.xTitle,
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
                      text: graphData.yTitle,
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
                    display: "Political Party", 
                    position: 'top',
                    labels:{
                      font:{
                        size:16
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: graphData.title,
                    font: {
                      size: 28,
                      weight: 'bold',
                    },
                  color: '#000000'

                  }
                }
              },
        })

        return () => {
            BarChart.destroy()
        }
    }, [graphData])

    return (
        <div className= " border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full" ></canvas>
          </div>

        </div>
    )
}

export default BarGraph