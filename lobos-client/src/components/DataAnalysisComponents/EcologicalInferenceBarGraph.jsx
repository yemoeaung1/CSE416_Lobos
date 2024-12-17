import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-chart-error-bars";
import axios from "axios";
import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';

Chart.register(BarWithErrorBarsController, BarWithErrorBar,);

const EcologicalInferenceBarGraph = ({ selectedState, filter }) => {
    const chartRef = useRef(null);
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/ecological-inference/bar?state=${selectedState}&filter=${"race"}`
                );
                console.log(response.data)
                const { labels, dataSets, title, xlabel, ylabel } = response.data;

                // Transform the dataset to include error bars
                const transformedDataSets = dataSets.map((dataSet) => ({
                    label: dataSet.label,
                    data: dataSet.data.map((value, index) => ({
                        y: value,
                        yMin: [0.20968081438677413], // Lower bound of credible interval
                        yMax: [0.7641440538345341], // Upper bound of credible interval
                    })),
                    backgroundColor: dataSet.backgroundColor,
                    borderColor: dataSet.borderColor,
                    borderWidth: 1,
                }));

                setGraphData({
                    labels,
                    datasets: transformedDataSets,
                    title,
                    xTitle: xlabel,
                    yTitle: ylabel,
                });
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };
        fetchGraphData();
    }, [selectedState, filter]);

    useEffect(() => {
        if (!graphData) return;

        const ctx = chartRef.current.getContext("2d");

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        // Create the bar chart with error bars
        chartRef.current.chart = new Chart(ctx, {
            type: BarWithErrorBarsController.id,
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
                            font: { size: 18 },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: graphData.yTitle,
                            font: { size: 18 },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: graphData.title,
                        font: { size: 24, weight: "bold" },
                    },
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        });

        return () => {
            if (chartRef.current.chart) chartRef.current.chart.destroy();
        };
    }, [graphData]);

    return (
        <div className="flex justify-center items-center">
            <canvas ref={chartRef} width="600" height="400"></canvas>
        </div>
    );
};

export default EcologicalInferenceBarGraph
