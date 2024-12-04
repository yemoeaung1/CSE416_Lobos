import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
import axios from "axios";

const IncomeVotingScatter = ({ selectedFilter, selectedState }) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [precinctData, setPrecinctData] = useState([]);
    const [selectedIncomeLevel, setSelectedIncomeLevel] = useState("all");
    const [selectedRace, setSelectedRace] = useState("non-hispanic");
    // Fetch precinct data whenever the selected state changes
    useEffect(() => {
        if (!selectedState) {
            return; // Do not proceed until a state is selected
        }

        const fetchPrecinctData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use selectedState in the API call to fetch the relevant data
                const response = await axios.get(
                    `http://localhost:8080/api/precinct-data?state=${selectedState}`
                );
                setPrecinctData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchPrecinctData();
    }, [selectedState]);

    useEffect(() => {
        if (loading || error || !precinctData.length) {
            return; // Do not proceed if data is still loading, if there's an error, or if there's no data
        }

        // Filter data based on selected income level
        const filteredData = precinctData.filter((precinct) => {
            if (selectedIncomeLevel === "low") {
                return precinct.median_income < 50000;
            } else if (selectedIncomeLevel === "medium") {
                return (
                    precinct.median_income >= 50000 &&
                    precinct.median_income <= 100000
                );
            } else if (selectedIncomeLevel === "high") {
                return precinct.median_income > 100000;
            }
            return true; // For "all", return all data
        });

        // Prepare the data for Democrat and Republican voters
        let democratData = [];
        let republicanData = [];

        if (selectedFilter === "income") {
            democratData = filteredData.map((precinct) => ({
                x: precinct.median_income,
                y: precinct.democrat_percentage,
            }));

            republicanData = filteredData.map((precinct) => ({
                x: precinct.median_income,
                y: precinct.republican_percentage,
            }));
        } else if (selectedFilter === "race") {
            // Placeholder for future implementation of race data
            democratData = [];
            republicanData = [];
        }

        // Calculate min and max x-values from the filtered data to adapt to income range
        const allXValues = [...democratData, ...republicanData].map(
            (point) => point.x
        );
        const minX = Math.min(...allXValues);
        let maxX = Math.max(...allXValues);

        // Limit the maxX to 175,000 when "all" incomes are selected
        if (selectedIncomeLevel === "all") {
            maxX = Math.min(maxX, 175000);
        }

        // Scaling factor for x-values (optional)
        const scalingFactor = 10000;

        // Scale down x-values for regression calculations
        const scaledDemocratData = democratData.map((point) => ({
            x: point.x / scalingFactor,
            y: point.y,
        }));
        const scaledRepublicanData = republicanData.map((point) => ({
            x: point.x / scalingFactor,
            y: point.y,
        }));

        // Generate smooth points for the regression line
        const generateRegressionPoints = (
            regressionResult,
            minX,
            maxX,
            step,
            scalingFactor
        ) => {
            const points = [];
            for (let x = minX; x <= maxX; x += step) {
                const scaledX = x / scalingFactor; // Scale x-value before prediction
                const y = regressionResult.predict(scaledX)[1]; // Predict the Y value
                points.push({ x, y }); // Use original x-value for plotting
            }
            return points;
        };

        // Perform polynomial regression (degree 2)
        const regressionDemocrat = regression.polynomial(
            scaledDemocratData.map((point) => [point.x, point.y]),
            { order: 2 }
        );
        const regressionRepublican = regression.polynomial(
            scaledRepublicanData.map((point) => [point.x, point.y]),
            { order: 2 }
        );

        // Define a step size for generating regression points
        const stepSize = (maxX - minX) / 100;

        // Generate regression line data using original x-values
        const regressionDataDemocrat = generateRegressionPoints(
            regressionDemocrat,
            minX,
            maxX,
            stepSize,
            scalingFactor
        );
        const regressionDataRepublican = generateRegressionPoints(
            regressionRepublican,
            minX,
            maxX,
            stepSize,
            scalingFactor
        );

        const chartData = {
            datasets: [
                {
                    label: "Democrat Voters",
                    data: democratData,
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                    borderColor: "rgba(0, 0, 255, 1)",
                    borderWidth: 1,
                    showLine: false,
                },
                {
                    label: "Republican Voters",
                    data: republicanData,
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 1,
                    showLine: false,
                },
                {
                    type: "line",
                    label: "Democrat Regression Line",
                    data: regressionDataDemocrat,
                    borderColor: "rgba(0, 0, 255, 1)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    type: "line",
                    label: "Republican Regression Line",
                    data: regressionDataRepublican,
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                },
            ],
        };

        const getChartTitle = () => {
            if (selectedFilter === "income") {
                return "Voting Trends by Income";
            } else if (selectedFilter === "race") {
                return "Voting Trends by Race";
            } else {
                return "Voting Trends";
            }
        };
        const scatterOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Annual Income Range ($)",
                        font: {
                            size: 18,
                            weight: "bold",
                            color: "#000000",
                        },
                    },
                    min: minX, // Set the x-axis minimum dynamically
                    max: maxX, // Set the x-axis maximum dynamically (or 150,000 for "all")
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString(); // Display original x-values
                        },
                        font: { size: 14 },
                    },
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: "Percentage of Voters",
                        font: {
                            weight: "bold",
                            size: 18,
                        },
                    },
                    ticks: {
                        callback: function (value) {
                            return `${value}%`;
                        },
                        font: {
                            size: 14,
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: getChartTitle(),
                    font: {
                        size: 30,
                        weight: "bold",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || "";
                            if (label.includes("Regression Line")) {
                                return "";
                            } else {
                                const xValue =
                                    context.parsed.x.toLocaleString();
                                const yValue = context.parsed.y;
                                return `${label}: (${xValue}, ${yValue}%)`;
                            }
                        },
                    },
                },
            },
        };

        // Create the chart
        const ctx = chartRef.current.getContext("2d");
        const scatterChart = new Chart(ctx, {
            type: "scatter",
            data: chartData,
            options: scatterOptions,
        });

        // Cleanup
        return () => {
            scatterChart.destroy();
        };
    }, [loading, error, precinctData, selectedFilter, selectedIncomeLevel]);

    if (!selectedState) {
        return <div>Please select a state to see the voting trends.</div>;
    }

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (selectedFilter === "income") {
        return (
            <div className="border-2 rounded-xl border-black h-full w-full">
                <div className="flex items-center mb-4">
                    {/* Dropdown for Income Filter */}
                    <select
                        value={selectedIncomeLevel}
                        onChange={(e) => setSelectedIncomeLevel(e.target.value)}
                        className="text-xl font-semibold border-2 border-black rounded-xl p-2 mr-4"
                    >
                        <option value="all">All Incomes</option>
                        <option value="low">Low Income (Below $50,000)</option>
                        <option value="medium">
                            Medium Income ($50,000 - $100,000)
                        </option>
                        <option value="high">
                            High Income (Above $100,000)
                        </option>
                    </select>
                </div>
                <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
        );
    } else {
        return (
            <div className="border-2 rounded-xl border-black h-full w-full">
                {/* Render race dropdown if selected filter is race */}
                {selectedFilter === "race" && (
                    <div className="mb-4">
                        <label
                            htmlFor="raceFilter"
                            className="font-semibold mr-2"
                        >
                            Select Race:
                        </label>
                        <select
                            id="raceFilter"
                            value={selectedRace}
                            onChange={(e) => setSelectedRace(e.target.value)}
                            className="border-2 border-black rounded-md p-2"
                        >
                            <option value="hispanic">Hispanic</option>
                            <option value="non-hispanic">Non-Hispanic</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                        </select>
                    </div>
                )}
                <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
        );
    }
};

export default IncomeVotingScatter;
