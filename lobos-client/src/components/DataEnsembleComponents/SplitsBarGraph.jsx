import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { States } from "../../enums";

const SplitsBarGraph = ({ selectedState }) => {
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
                    `http://localhost:8080/api/ensemble/splits?state=${selectedState}`
                );
                setGraphData(response.data);
                console.log(response.data);
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
                labels: graphData.labels, // x-axis labels
                datasets: [
                    {
                        label: graphData.yLabel, // Label for the dataset
                        data: graphData.data, // y-axis values
                        backgroundColor: graphData.backgroundColor, // Bar colors
                        borderColor: graphData.borderColor, // Border color
                        borderWidth: graphData.borderWidth, // Border width
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
            <div className="flex-1 flex w-5/6 h-5/6 mx-auto my-auto">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default SplitsBarGraph;
