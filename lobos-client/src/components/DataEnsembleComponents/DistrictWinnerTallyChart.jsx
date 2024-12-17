import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { States } from "../../enums";

const DistrictWinCountGraph = ({ selectedState }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (selectedState === States.NONE) {
      return; // Do not proceed until a state is selected
    }

    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/ensemble/district-win-counts?state=${selectedState}`
        );
        setGraphData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error("Error fetching graph data:", error);
      }
    };
    fetchGraphData();
  }, [selectedState]);

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
              },
              ticks: {
                font: {
                  size: 18,
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
              },
              ticks: {
                font: {
                  size: 18,
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
              },
            },
          },
          title: {
            display: true,
            text: graphData.title, // Chart title
            font: {
              size: 22,
              weight: "bold",
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
    <div className="flex-1 flex justify-center items-center">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default DistrictWinCountGraph;
