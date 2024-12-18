import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function BarGraph({ graphData }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!graphData) return;

        const ctx = chartRef.current.getContext("2d");

        const BarChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: graphData.labels,
                datasets: graphData.datasets,
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: graphData.xTitle,
                            font: {
                                size: 20,
                                family: "Montserrat, sans-serif",
                            },
                            color: "#000000",
                        },
                        ticks: {
                            font: {
                                size: 16,
                                family: "Montserrat, sans-serif",
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: graphData.yTitle,
                            font: {
                                size: 20,
                                family: "Montserrat, sans-serif",
                            },
                            color: "#000000",
                        },
                        ticks: {
                            font: {
                                size: 16,
                                family: "Montserrat, sans-serif",
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: graphData.title,
                        font: {
                            size: 24,
                            weight: "bold",
                            family: "Montserrat, sans-serif",
                        },
                        color: "#000000",
                    },
                },
            },
        });

        return () => {
            BarChart.destroy();
        };
    }, [graphData]);

    return (
        <div className="flex-1">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
    );
};

export default BarGraph;
