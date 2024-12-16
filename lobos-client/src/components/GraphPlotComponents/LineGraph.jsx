import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { data } from "autoprefixer";

export default function LineGraph({ graphData, title }) {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    console.log(graphData.labels)

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
          backgroundColor: dataset.borderColor,
          fill: { target: "origin", above: dataset.borderColor },
          tension: 0.5,
          pointRadius: 0
        })),
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Support Level",
              font: {
                size: 20,
              },
              color: "#000000",
            },
            ticks: {
              stepSize: 0.2,
              callback: (value) => value.toFixed(1),
              font: {
                size: 14,
              },
            },
            min: 0.0,
            max: 1.0,
          },
          y: {
            beginAtZero: true,
            max: 20,
            title: {
              display: true,
              text: "Probability Density",
              font: {
                size: 16,
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
            display: true,
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
              size: 22,
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
      <div className="flex-1 flex justify-center items-center w-full h-full">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
  );
}
