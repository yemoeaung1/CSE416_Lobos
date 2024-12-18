import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-chart-error-bars";
import axios from "axios";
import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';

Chart.register(BarWithErrorBarsController, BarWithErrorBar);

const EcologicalInferenceBarGraph = ({ selectedState, filter }) => {
    const chartRef = useRef(null);
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/ecological-inference/bar?state=${selectedState}&filter=${filter}`
                );
        
                const { labels, dataSets, title, xlabel, ylabel } = response.data;

                console.log(response.data.dataSets[0].errorBars[0])
        
                const transformedDataSets = dataSets.map((dataSet) => {
                    const alignedData = labels.map((_, index) => ({
                        y: dataSet.data[index] || null,
                        yMin: dataSet.errorBars[index].yMin,
                        yMax: dataSet.errorBars[index].yMax,
                    }));
        
                    return {
                        label: dataSet.label,
                        data: alignedData,
                        backgroundColor: dataSet.backgroundColor[0],
                        borderColor: dataSet.borderColor[0],
                        borderWidth: 1,
                    };
                });
        
                setGraphData({
                    labels,
                    datasets: transformedDataSets,
                    title,
                    xTitle: xlabel,
                    yTitle: ylabel,
                    errorBars: true,
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
                            font: { size: 18, family: "Montserrat, sans-serif"},
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: graphData.yTitle,
                            font: { size: 18 , family: "Montserrat, sans-serif"},
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: graphData.title,
                        font: { size: 24, weight: "bold", family: "Montserrat, sans-serif"},
                    },
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        });
    
        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
                chartRef.current.chart = null;
            }
        };
    }, [graphData]);    

    return (
        <div className="flex justify-center items-center h-full w-full">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default EcologicalInferenceBarGraph
