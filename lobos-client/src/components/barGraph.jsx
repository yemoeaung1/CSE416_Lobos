import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { Minus, X, Minimize, Maximize} from 'lucide-react';
import { Rnd } from "react-rnd"

const BarGraph = () =>{
    const chartRef = useRef(null)

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const initialX = (screenWidth - 384) / 2;
    const initialY = (screenHeight - 384) / 2;

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
        <div className="min-h-screen">
          <Rnd
          default={{
            x: initialX,
            y: initialY,
            width: 384,
            height: 384,
          }}>
            <div className="w-full h-full border-2 border-gray-600 rounded-xl shadow-2xl">
                
                <div className="p-4 flex justify-end space-x-2">
                    <button className="text-gray-500 pr-2 hover:text-gray-700">
                        <Minus size={16}/>
                    </button>
                    
                    <button className="text-gray-500 pr-2 hover:text-gray-700">
                        <Maximize size={16}/>
                    </button>

                    <button className="text-gray-500 hover:text-gray-700">
                        <X size={16}/>
                    </button>
                </div>

                <div className="flex justify-center mb-2">
                  <h1 className="font-bold text-2xl">
                    Title of the Chart
                  </h1>
                </div>

                <div className="">
                  <canvas className="pl-4 pr-4" ref={chartRef} width={500} height={400}></canvas>
                </div>
            </div>
          </Rnd>
        </div>
      
        
    )
}

export default BarGraph