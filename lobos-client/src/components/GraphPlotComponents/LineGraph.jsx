import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

export default function LineGraph({ graphData, title }) {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    console.log(graphData.dataset)

    const LineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: graphData.labels,
        datasets: graphData.dataSets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data.map((y, idx) => ({
            x: parseFloat(graphData.labels[idx]),
            y: y,
          })),
          borderColor: dataset.borderColor,
          borderWidth: dataset.borderWidth,
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          fill: { target: "origin", above: "rgba(0, 0, 255, 0.2)" },
          tension: 0.5,
          pointRadius: 0
        })),
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear", // Explicitly set axis type to linear
            title: {
              display: true,
              text: "Support Level",
              font: {
                size: 20,
              },
              color: "#000000",
            },
            ticks: {
              stepSize: 0.2, // Increment ticks by 0.2
              callback: (value) => value.toFixed(1), // Format values as one decimal place
              font: {
                size: 14,
              },
            },
            min: 0.0,
            max: 1.0,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Probability Density",
              font: {
                size: 20,
              },
              color: "#000000",
            },
            ticks: {
              font: {
                size: 18,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
            labels: {
              font: {
                size: 16,
              },
            },
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 28,
              weight: "bold",
            },
            color: "#000000",
          },
        },
      },
    });

    setChartInstance(LineChart);

    return () => {
      LineChart.destroy();
    };
  }, [graphData]);

  return (
    // <div className= "mt-4 flex flex-col w-3/5 border-2 border-gray-800">
    <div className="flex flex-col border-b-2">
      <div className="flex-1 flex justify-center items-center">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
