import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import axios from 'axios';

const BarGraph = ({ dataSetType }) =>{
    const chartRef = useRef(null);
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
      const fetchGraphData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/graph/bar?filter=${dataSetType}`);
          setGraphData(response.data);
        } 
        catch (error) {
          console.error("Error fetching graph data:", error);
        }
      };
      fetchGraphData();
    }, [dataSetType]);

    useEffect(() => {
        if (!graphData) return;

        const ctx = chartRef.current.getContext("2d");

        const { labels, datasets, title, xLabel, yLabel } = graphData;

        const BarChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: datasets.map((dataset) => ({
                  label: dataset.label,
                  data: dataset.data,
                  backgroundColor: dataset.backgroundColor,
                  borderColor: dataset.borderColor,
                  borderWidth: dataset.borderWidth
                }))
              },
              options: {
                responsive: true,
                scales: {
                  x:{
                    title:{
                      display: true,
                      text: xLabel,
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
                      text: yLabel,
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
                    display: yLabel === "Political Party", 
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