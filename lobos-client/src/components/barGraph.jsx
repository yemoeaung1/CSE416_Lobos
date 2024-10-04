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
              { label: "Republican", data: [3000, 4943, 5920, 4134, 4234], backgroundColor: "rgba(255, 0, 0, 0.5)" },
              { label: "Democrat", data: [3000, 894, 590, 4234, 4234], backgroundColor: "rgba(0, 0, 255, 0.5)" },
              { label: "Independent", data: [30, 89, 59, 42, 44], backgroundColor: "rgba(0, 255, 0, 0.5)" }
            ],
            title: "Support for Candidates by Racial Group",
            xTitle: "Ethnicity"
          },
          income: {
            labels: ["<25k", "25-50k", "50-75k", "75-100k", ">100k"],
            data: [
              { label: "Republican", data: [2000, 1500, 3000, 4000, 6000], backgroundColor: "rgba(255, 0, 0, 0.5)" },
              { label: "Democrat", data: [1800, 1200, 2800, 3500, 5800], backgroundColor: "rgba(0, 0, 255, 0.5)" },
              { label: "Independent", data: [100, 90, 200, 300, 400], backgroundColor: "rgba(0, 255, 0, 0.5)" }
            ],
            title: "Support for Candidates by Income Bracket",
            xTitle: "Income"
          },
          age: {
            labels: ["18-25", "26-30", "36-42", "43-49", "65+"],
            data: [
              { label: "Republican", data: [2300, 1400, 1000, 2000, 4000], backgroundColor: "rgba(255, 0, 0, 0.5)" },
              { label: "Democrat", data: [4300, 3200, 1800, 2500, 4800], backgroundColor: "rgba(0, 0, 255, 0.5)" },
              { label: "Independent", data: [60, 40, 20, 360, 99], backgroundColor: "rgba(0, 255, 0, 0.5)" }
            ],
            title: "Support for Candidates by Age Group",
            xTitle: "Age"
          }
        };
    
        const { labels, data, title, xTitle} = dataSets[dataSetType];

        const BarChart = new Chart(ctx, {
            type: "bar",
            data: {
                // labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
                labels: labels,
                // datasets: [
                //   {
                //     label: "Republican",
                //     data: [3000, 4943, 5920, 4134, 4234], 
                //     backgroundColor: "rgba(255, 0, 0, 0.5)",
                //     borderColor: "rgba(255, 0, 0, 1)",
                //     borderWidth: 1
                //   },
                //   {
                //     label: "Democrat",
                //     data: [3000, 894, 590, 4234, 4234], 
                //     backgroundColor: "rgba(0, 0, 255, 0.5)",
                //     borderColor: "rgba(0, 0, 255, 1)",
                //     borderWidth: 1
                //   },
                //   {
                //     label: "Independent",
                //     data: [30, 89, 59, 42, 44], 
                //     backgroundColor: "rgba(0, 255, 0, 0.5)",
                //     borderColor: "rgba(0, 255, 0, 1)",
                //     borderWidth: 1
                //   },
                // ],
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
                      text: 'Number of Voters',
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
        <div className= " border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} ></canvas>
          </div>

        </div>
      
        
    )
}

export default BarGraph