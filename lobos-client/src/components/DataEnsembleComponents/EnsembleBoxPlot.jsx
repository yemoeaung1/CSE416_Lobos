import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { States } from "../../enums";
import axios from "axios";

Chart.register(BoxPlotController, BoxAndWiskers);


const BoxPlotGraph = ({ dataSetType, selectedState }) => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [dataSet, setDataSet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // console.log(selectedState);
    // console.log(dataSet);
    // console.log(dataSetType);

    useEffect(() => {
        if (selectedState === States.NONE) {
            return; // Do not proceed until a state is selected
        }

        const fetchEnsembleData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use selectedState in the API call to fetch the relevant data
                const response = await axios.get(
                    `http://localhost:8080/api/ensemble-data?state=${selectedState}&filter=${dataSetType}`
                );
                console.log(response.data);
                setDataSet(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };
        fetchEnsembleData();
    }, [selectedState, dataSetType]);

    useEffect(() => {
        if (loading || error || !dataSet) {
            return; // Do not proceed if data is still loading, if there's an error, or if there's no data
        }
        
        const ctx = chartRef.current.getContext("2d");



        const boxplotData = {
            labels: dataSet.labels,
            datasets: [
                ...dataSet.data
            ],
        };

        const BoxPlot = new Chart(ctx, {
            type: "boxplot",
            data: boxplotData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Districts",
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
                            text: "Percentage",
                            font: {
                                size: 20,
                            },
                            ticks: {
                                font: {
                                    size: 18,
                                },
                                color: "#000000",
                            },
                            color: "#000000",
                        },
                        beginAtZero: false,
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
                        text: dataSet.title,
                        font: {
                            size: 28,
                            weight: "bold",
                        },
                        color: "#000000",
                    },
                },
            },
        });

        setChartInstance(BoxPlot);

        return () => {
            BoxPlot.destroy();
        };
    }, [dataSet]);

    return (
        <div className="h-1/2 w-102">
            <div className="flex-1 flex justify-center items-center">
                <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
        </div>
    );
};

export default BoxPlotGraph;
