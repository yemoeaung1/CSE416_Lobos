import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';

const LineGraph = () =>{
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [currentDataset, setCurrentDataset] = useState("race")

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const data = [3000, 4943, 5920, 4134, 4234];
        const labels = ["Asian", "Hispanic", "Black", "White", "American Indian"]

        const LineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
                datasets: [
                  {
                    label: "Republican",
                    data: [3000, 4943, 5920, 4134, 4234], 
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 1,
                    fill: {
                        target: 'origin',
                        above: 'rgba(255, 0, 0, 0.2)',
                    },
                    tension: 0.5

                  },
                  {
                    label: "Democrat",
                    data: [3000, 894, 590, 4234, 4234], 
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                    borderColor: "rgba(0, 0, 255, 1)",
                    borderWidth: 1,
                    tension: 0.5,
                    fill: {
                        target: 'origin',
                        above: 'rgba(0, 0, 255, 0.2)',
                    },

                  },
                  {
                    label: "Independent",
                    data: [30, 89, 59, 42, 44], 
                    backgroundColor: "rgba(0, 255, 0, 0.5)",
                    borderColor: "rgba(0, 255, 0, 1)",
                    borderWidth: 1,
                    tension: 0.5,
                    fill: {
                        target: 'origin',
                        above: 'rgba(0, 255, 0, 0.2)',
                    }
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  x:{
                    title:{
                      display: true,
                      text: "Ethnicity",
                      font: {
                        size: 15,
                      },
                      color: '#000000'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Voters',
                      font: {
                        size: 15,
                      },
                      color: '#000000'
                    }
                  },
                },
                plugins:{
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Support for Candidates by Racial Group',
                    font: {
                      size: 20,
                    }

                  }
                }
              },
        })

        setChartInstance(LineChart);

        return () => {
            LineChart.destroy()
        }
    }, [])

    const updateChart = (type) => {
      if (!chartInstance) return;
  
      if (type === "race") {
        setCurrentDataset('race')
        chartInstance.data.labels = ["Asian", "Hispanic", "Black", "White", "American Indian"];
        chartInstance.data.datasets[0].data = [3000, 4943, 5920, 4134, 4234];
        chartInstance.data.datasets[1].data = [3000, 894, 590, 4234, 4234];
        chartInstance.data.datasets[2].data = [30, 89, 59, 42, 44];
        chartInstance.options.plugins.title.text = "Support for Candidates by Racial Group";
        chartInstance.options.scales.x.title.text = "Ethnicity"
      } 
      else if (type === "income") {
        setCurrentDataset('income')
        chartInstance.data.labels = ["<25k", "25-50k", "50-75k", "75-100k", ">100k"];
        chartInstance.data.datasets[0].data = [2000, 1500, 3000, 4000, 6000];
        chartInstance.data.datasets[1].data = [1800, 1200, 2800, 3500, 5800];
        chartInstance.data.datasets[2].data = [100, 90, 200, 300, 400];
        chartInstance.options.plugins.title.text = "Support for Candidates by Income";
        chartInstance.options.scales.x.title.text = "Income"
      }
      else if (type === "age"){
        setCurrentDataset('age')
        chartInstance.data.labels = ["18-25", "26-30", "36-42", "43-49", "65+"];
        chartInstance.data.datasets[0].data = [2300, 1400, 1000, 2000, 4000];
        chartInstance.data.datasets[1].data = [4300, 3200, 1800, 2500, 4800];
        chartInstance.data.datasets[2].data = [60, 40, 20, 360, 99];
        chartInstance.options.plugins.title.text = "Support for Candidates by Age";
        chartInstance.options.scales.x.title.text = "Age"
      }
  
      chartInstance.update();
    };

    return (
        // <div className= "mt-4 flex flex-col w-3/5 border-2 border-gray-800">
        <div className= "mt-4 flex flex-col border-2 border-gray-800 rounded-xl shadow-xl">
          <div className="border-gray-800 justify-center flex m-8">
            <button className= {currentDataset === 'race' ? 'border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-red-400' :
            'border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-red-200'}
            onClick={() => updateChart("race")}>Race </button>

            <button className={currentDataset === 'income' ? 'border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-red-400' :
            'border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-red-200'}
             onClick={() => updateChart("income")}> Income </button>

             <button className={currentDataset === 'age' ? 'border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-red-400' :
            'border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-red-200'}
             onClick={() => updateChart("age")}> Age </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </div>
      
        
    )
}

export default LineGraph