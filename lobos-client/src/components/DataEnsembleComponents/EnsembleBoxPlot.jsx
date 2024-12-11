import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
Chart.register(BoxPlotController, BoxAndWiskers);


const BoxPlotGraph = ({ dataSetType }) => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const transformData = (data) => {
            return Object.values(data).map((item) => ({
                min: item.min,
                q1: item.q1,
                median: item.median,
                q3: item.q3,
                max: item.max,
            }));
        };
        
        const dataSets = {
            hispanic: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Hispanic Data",
                        backgroundColor: "rgba(0,0,255,0.5)",
                        borderColor: "blue",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 72255.0, q1: 94007.0, median: 105184.0, q3: 123292.0, max: 200210.0 },
                            { min: 70542.0, q1: 93742.0, median: 107414.0, q3: 122009.0, max: 198473.0 },
                            { min: 79145.0, q1: 99336.0, median: 111660.0, q3: 155380.0, max: 195948.0 },
                            { min: 75513.0, q1: 94259.0, median: 110663.0, q3: 150366.0, max: 199970.0 }
                        ]
                    },
                ],
                title: "Hispanic Data Distribution",
            },
            black: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Black Data",
                        backgroundColor: "rgba(0,255,0,0.5)",
                        borderColor: "green",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 3753.0, q1: 4536.0, median: 6843.0, q3: 9605.0, max: 16659.0 },
                            { min: 3616.0, q1: 5154.0, median: 7663.0, q3: 9061.0, max: 16837.0 },
                            { min: 3828.0, q1: 6447.0, median: 8142.0, q3: 12761.0, max: 16453.0 },
                            { min: 3764.0, q1: 5434.0, median: 7734.0, q3: 12434.0, max: 16268.0 }
                        ],
                    },
                ],
                title: "Black Data Distribution",
            },
            asian: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Asian Data",
                        backgroundColor: "rgba(255,0,0,0.5)",
                        borderColor: "red",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 7152.0, q1: 9384.0, median: 14002.0, q3: 22136.0, max: 37998.0 },
                            { min: 6823.0, q1: 11777.0, median: 15035.0, q3: 21200.0, max: 37017.0 },
                            { min: 6842.0, q1: 12675.0, median: 19308.0, q3: 30397.0, max: 36258.0 },
                            { min: 6287.0, q1: 12485.0, median: 18620.0, q3: 28256.0, max: 36981.0 }
                        ],
                    },
                ],
                title: "Asian Data Distribution",
            },
            white: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "White Data",
                        backgroundColor: "rgba(0,255,255,0.5)",
                        borderColor: "cyan",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 510004.0, q1: 623843.0, median: 659181.0, q3: 671466.0, max: 695602.0 },
                            { min: 510590.0, q1: 627428.0, median: 655858.0, q3: 667361.0, max: 698175.0 },
                            { min: 516661.0, q1: 581594.0, median: 638759.0, q3: 660466.0, max: 687575.0 },
                            { min: 517232.0, q1: 580842.0, median: 647770.0, q3: 663684.0, max: 687063.0 }
                        ],
                    },
                ],
                title: "White Data Distribution",
            },
            american_indian: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "American Indian Data",
                        backgroundColor: "rgba(255,255,0,0.5)",
                        borderColor: "yellow",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 1865.0, q1: 2565.0, median: 3711.0, q3: 13836.0, max: 14498.0 },
                            { min: 2008.0, q1: 2520.0, median: 2903.0, q3: 11756.0, max: 14791.0 },
                            { min: 1700.0, q1: 2538.0, median: 3525.0, q3: 4136.0, max: 14815.0 },
                            { min: 1842.0, q1: 2543.0, median: 3420.0, q3: 4373.0, max: 14357.0 }
                        ],
                    },
                ],
                title: "American Indian Data Distribution",
            },
            urban: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Urban Data",
                        backgroundColor: "rgba(128,0,128,0.5)",
                        borderColor: "purple",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 339849.0, q1: 443339.0, median: 641185.0, q3: 729763.0, max: 798988.0 },
                            { min: 334466.0, q1: 547448.0, median: 635730.0, q3: 725938.0, max: 815085.0 },
                            { min: 309288.0, q1: 613277.0, median: 686201.0, q3: 742917.0, max: 806788.0 },
                            { min: 346095.0, q1: 599339.0, median: 691773.0, q3: 744836.0, max: 808934.0 }
                        ],
                    },
                ],
                title: "Urban Data Distribution",
            },
            suburban: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Suburban Data",
                        backgroundColor: "rgba(255,165,0,0.5)",
                        borderColor: "orange",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 18671.0, q1: 82265.0, median: 153148.0, q3: 205375.0, max: 274302.0 },
                            { min: 18731.0, q1: 79635.0, median: 149865.0, q3: 185033.0, max: 278557.0 },
                            { min: 19624.0, q1: 66342.0, median: 111105.0, q3: 159516.0, max: 297124.0 },
                            { min: 16899.0, q1: 66587.0, median: 103597.0, q3: 164922.0, max: 273553.0 }
                        ],
                    },
                ],
                title: "Suburban Data Distribution",
            },
            rural: {
                labels: ["District 1", "District 2", "District 3", "District 4"],
                data: [
                    {
                        label: "Rural Data",
                        backgroundColor: "rgba(255,192,203,0.5)",
                        borderColor: "pink",
                        borderWidth: 1,
                        outlierColor: "#999999",
                        padding: 5,
                        itemRadius: 0,
                        data: [
                            { min: 40.0, q1: 11929.0, median: 38141.0, q3: 174767.0, max: 203726.0 },
                            { min: 406.0, q1: 13301.0, median: 35272.0, q3: 158826.0, max: 195640.0 },
                            { min: 1489.0, q1: 11872.0, median: 35850.0, q3: 152474.0, max: 218777.0 },
                            { min: 345.0, q1: 12138.0, median: 38553.0, q3: 168650.0, max: 220220.0 }
                        ],
                    },
                ],
                title: "Rural Data Distribution",
            }
        };        

        const { labels, data, title } = dataSets[dataSetType]

        const boxplotData = {
            labels: labels,
            datasets: data,
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
                            text: "Value",
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
                        beginAtZero: true,
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

        setChartInstance(BoxPlot);

        return () => {
            BoxPlot.destroy();
        };
    }, [dataSetType]);

    return (
        <div className="border-2 border-gray-800 rounded-xl shadow-xl h-1/2">
            <div className="flex-1 flex justify-center items-center">
                <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
        </div>
    );
};

export default BoxPlotGraph;
