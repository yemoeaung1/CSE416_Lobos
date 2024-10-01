import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { Minus, X, Minimize, Maximize} from 'lucide-react';

const BarGraph = () =>{
    const chartRef = useRef(null)

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const myChart= new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Asian", "Hispanic", "Black", "White", "American Indian"],
                datasets: [
                  {
                    label: "Race",
                    data: [3000, 8943, 5920, 42134, 40234], 
                    backgroundColor: "rgba(76, 200, 200, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              },
        })
        return () => {
            myChart.destroy()
        }
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-96 h-96 border-2 border-gray-700 rounded-xl p-8">
                <div>
                    <button className="text-gray-500 pr-2 hover:text-gray-700">
                        <X size={16}/>
                    </button>
                    <button className="text-gray-500 pr-2 hover:text-gray-700">
                        <Maximize size={16}/>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                        <Minus size={16}/>
                    </button>
                    <canvas ref={chartRef} width={600} height={600}></canvas>
                </div>

            </div>
        </div>
        
    )
}

export default BarGraph