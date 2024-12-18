import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { States } from "../../enums";

const DistrictWinCountGraph = ({ graphData }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || error || !graphData) {
      return; // Do not proceed if data is still loading, if there's an error, or if there's no data
    }

    const ctx = chartRef.current.getContext("2d");

    const BarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: graphData.labels.map(label => `District ${label}`),
        datasets: [
          {
            label: graphData.republicanLabel,
            data: graphData.republicanWins,
            backgroundColor: graphData.republicanColor,
            borderColor: graphData.borderColor,
            borderWidth: graphData.borderWidth,
          },
          {
            label: graphData.democratLabel,
            data: graphData.democratWins,
            backgroundColor: graphData.democratColor,
            borderColor: graphData.borderColor,
            borderWidth: graphData.borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: graphData.xLabel,
              font: {
                size: 20,
                family: "Montserrat, sans-serif",
              },
              ticks: {
                font: {
                  size: 18,
                  family: "Montserrat, sans-serif",
                },
              },
              color: "#000000",
            },
          },
          y: {
            title: {
              display: true,
              text: graphData.yLabel,
              font: {
                size: 20,
                family: "Montserrat, sans-serif",
              },
              ticks: {
                font: {
                  size: 18,
                  family: "Montserrat, sans-serif",
                },
              },
              beginAtZero: true, // Ensure the y-axis starts at zero
              color: "#000000",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 16,
                family: "Montserrat, sans-serif",
              },
            },
          },
          title: {
            display: true,
            text: graphData.title, // Chart title
            font: {
              size: 22,
              weight: "bold",
              family: "Montserrat, sans-serif",
            },
            color: "#000000",
          },
        },
      },
    });

    // setChartInstance(BarChart);

    return () => {
      BarChart.destroy();
    };
  }, [graphData]);

  return (
    <div className="w-full h-full my-8">
      <div className="flex-1 flex w-5/6 mx-auto my-auto">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DistrictWinCountGraph;
