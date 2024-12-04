import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
<<<<<<< HEAD


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
              { label: "Republican", data: [8020], backgroundColor: "rgba(255, 0, 0, 0.5)" },
              { label: "Democrat", data: [1890], backgroundColor: "rgba(0, 0, 255, 0.5)" },
              { label: "Independent", data: [300], backgroundColor: "rgba(0, 255, 0, 0.5)" }
            ],
            title: "Support for Candidates by Party",
            xTitle: "Political Party"
          },
          race: {
            labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
            data: [
              {data: [3000, 894, 590, 4234, 2456], backgroundColor: "rgba(0, 0, 255, 0.5)" },
            ],
            title: "Support for Candidates by Racial Group",
            xTitle: "Ethnicity"
          },
          income: {
            labels: ["<25k", "25-50k", "50-75k", "75-100k", ">100k"],
            data: [
              { label: "Democrat", data: [1800, 1200, 2800, 3500, 5800], backgroundColor: "rgba(0, 0, 255, 0.5)" },
            ],
            title: "Support for Candidates by Income Bracket",
            xTitle: "Income"
          },
          age: {
            labels: ["18-25", "26-30", "36-42", "43-49", "65+"],
            data: [
              { label: "Democrat", data: [4300, 3200, 1800, 2500, 4800], backgroundColor: "rgba(0, 0, 255, 0.5)" },
            ],
            title: "Support for Candidates by Age Group",
            xTitle: "Age"
          }
        };
    
        const { labels, data, title, xTitle} = dataSets[dataSetType];
=======
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
>>>>>>> origin/test-cody

        const BarChart = new Chart(ctx, {
            type: "bar",
            data: {
<<<<<<< HEAD
                labels: labels,
                datasets: data
=======
                labels: graphData.labels,
                datasets: graphData.datasets
>>>>>>> origin/test-cody
              },
              options: {
                responsive: true,
                scales: {
                  x:{
                    title:{
                      display: true,
<<<<<<< HEAD
                      text: xTitle,
=======
                      text: graphData.xTitle,
>>>>>>> origin/test-cody
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
<<<<<<< HEAD
                      text: 'Number of Voters',
=======
                      text: graphData.yTitle,
>>>>>>> origin/test-cody
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
<<<<<<< HEAD
                    display: xTitle === "Political Party", 
=======
                    display: "Political Party", 
>>>>>>> origin/test-cody
                    position: 'top',
                    labels:{
                      font:{
                        size:16
                      }
                    }
                  },
                  title: {
                    display: true,
<<<<<<< HEAD
                    text: title,
=======
                    text: graphData.title,
>>>>>>> origin/test-cody
                    font: {
                      size: 28,
                      weight: 'bold',
                    },
                  color: '#000000'

                  }
                }
              },
        })

<<<<<<< HEAD
        setChartInstance(BarChart);

        return () => {
            BarChart.destroy()
        }
    }, [dataSetType])
=======
        return () => {
            BarChart.destroy()
        }
    }, [graphData])
>>>>>>> origin/test-cody

    return (
        <div className= " border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="flex-1 flex justify-center items-center">
<<<<<<< HEAD
            <canvas ref={chartRef} ></canvas>
          </div>

        </div>
      
        
=======
            <canvas ref={chartRef} className="w-full h-full" ></canvas>
          </div>

        </div>
>>>>>>> origin/test-cody
    )
}

export default BarGraph