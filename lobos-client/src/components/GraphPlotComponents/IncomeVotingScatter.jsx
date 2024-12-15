import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
import axios from "axios";
import { States } from "../../enums";

const IncomeVotingScatter = ({
    selectedFilter,
    selectedState,
    onSelectGEOID,
    onPrecinctDataFetched,
}) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [precinctData, setPrecinctData] = useState([]);
    const [selectedIncomeLevel, setSelectedIncomeLevel] = useState("all");
    const [selectedRace, setSelectedRace] = useState("white");
    const [selectedRace2, setSelectedRace2] = useState("white");
    const [selectedRegion, setSelectedRegion] = useState("all");

    // Fetch precinct data whenever the selected state changes
    useEffect(() => {
        if (selectedState === States.NONE) {
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
                // Pass the fetched data to AnalysisTab
                onPrecinctDataFetched(response.data);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchPrecinctData();
    }, [selectedState, onPrecinctDataFetched]);

    useEffect(() => {
        if (loading || error || !precinctData.length) {
            return; // Do not proceed if data is still loading, if there's an error, or if there's no data
        }

        // Filter data based on selected income level
        const filteredData = precinctData.filter((precinct) => {
            // Income and region filtering logic
            if (
                selectedIncomeLevel === "low" &&
                precinct.median_income >= 50000
            ) {
                return false;
            } else if (
                selectedIncomeLevel === "medium" &&
                (precinct.median_income < 50000 ||
                    precinct.median_income > 100000)
            ) {
                return false;
            } else if (
                selectedIncomeLevel === "high" &&
                precinct.median_income <= 100000
            ) {
                return false;
            }
            // Region type filter
            if (
                selectedRegion !== "all" &&
                precinct.region_type.toLowerCase() !== selectedRegion
            ) {
                return false;
            }
            return true;
        });

        // Prepare the data for Democrat and Republican voters
        let democratData = [];
        let republicanData = [];

        if (selectedFilter === "income") {
            democratData = filteredData.map((precinct) => ({
                x: precinct.median_income,
                y: precinct.democrat_percentage,
                geoid: precinct.geoid,
            }));

            republicanData = filteredData.map((precinct) => ({
                x: precinct.median_income,
                y: precinct.republican_percentage,
                geoid: precinct.geoid,
            }));
        } else if (selectedFilter === "race") {
            democratData = precinctData.map((precinct) => ({
                x: precinct[`${selectedRace}_percentage`],
                y: precinct.democrat_percentage,
                geoid: precinct.geoid,
            }));
            republicanData = precinctData.map((precinct) => ({
                x: precinct[`${selectedRace}_percentage`],
                y: precinct.republican_percentage,
                geoid: precinct.geoid,
            }));
        } else if (selectedFilter === "income&race") {
            democratData = filteredData
                .map((precinct) => ({
                    x: precinct[`combined_${selectedRace2}`],
                    y: precinct.democrat_percentage,
                    geoid: precinct.geoid,
                }))
                .filter((point) => point.x !== 0);

            republicanData = filteredData
                .map((precinct) => ({
                    x: precinct[`combined_${selectedRace2}`],
                    y: precinct.republican_percentage,
                    geoid: precinct.geoid,
                }))
                .filter((point) => point.x !== 0);
            console.log("Filtered Data for Income & Race:", filteredData);
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
                    label: "Democratic Voters",
                    data: democratData,
                    backgroundColor: "rgba(0, 0, 255, 1)",
                    //borderColor: "rgba(0, 0, 255, 1)",
                    //borderWidth: 1,
                    pointRadius: 2.5,
                    showLine: false,
                },
                {
                    label: "Republican Voters",
                    data: republicanData,
                    backgroundColor: "rgba(255, 0, 0, 1)",
                    //borderColor: "rgba(255, 0, 0, 1)",
                    //borderWidth: 1,
                    pointRadius: 2.5,
                    showLine: false,
                },
                {
                    type: "line",
                    label: "Democratic Regression Line",
                    data: regressionDataDemocrat,
                    borderColor: "rgba(0, 0, 255, 1)",
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    type: "line",
                    label: "Republican Regression Line",
                    data: regressionDataRepublican,
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0,
                },
            ],
        };
        console.log("Chart Data for Race:", chartData); // Add this here to inspect final chart data
        const getChartTitle = () => {
            if (selectedFilter === "income") {
                return "Voting Trends by Income";
            } else if (selectedFilter === "race") {
                return "Voting Trends by Race";
            } else {
                return "Voting Trends by Income/Race";
            }
        };
        const getXAxisRange = () => {
            if (selectedFilter === "income") {
                return { min: minX, max: maxX }; // Use the income range
            } else if (selectedFilter === "race") {
                if (selectedState === "Utah") {
                    switch (selectedRace) {
                        case "black":
                            return { min: 0, max: 25 };
                        case "asian":
                            return { min: 0, max: 70 };
                        case "hispanic":
                            return { min: 0, max: 80 };
                        case "non_hispanic":
                            return { min: 20, max: 100 };
                        default:
                            return { min: 0, max: 100 };
                    }
                } else if (selectedState === "South Carolina") {
                    switch (selectedRace) {
                        case "black":
                            return { min: 0, max: 100 };
                        case "asian":
                            return { min: 0, max: 25 };
                        case "hispanic":
                            return { min: 0, max: 60 };
                        case "non_hispanic":
                            return { min: 40, max: 100 };
                        default:
                            return { min: 0, max: 100 };
                    }
                }
            } else if (selectedFilter === "income&race") {
                switch (selectedRace2) {
                    case "black":
                        return { min: 20, max: 120 };
                    case "asian":
                        return { min: 0, max: 120 };
                    case "hispanic":
                        return { min: 0, max: 120 };
                    case "non_hispanic":
                        return { min: 40, max: 175 };
                    default:
                        return { min: 0, max: 175 };
                }
            }
            return { min: 0, max: 100 }; // Fallback range
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
                        text: getXAxisTitle(),
                        font: {
                            size: 18,
                            weight: "bold",
                            color: "#000000",
                        },
                    },
                    ...getXAxisRange(),
                    //min: selectedFilter === "race" ? 0 : minX, // Set to 0 for race
                    //max: selectedFilter === "race" ? 100 : maxX, // Set to 100 for race
                    ticks: {
                        callback: function (value) {
                            return `${value.toLocaleString()}${
                                selectedFilter === "race" ? "%" : ""
                            }`;
                        },
                        font: { size: 14 },
                    },
                },
                y: {
                    beginAtZero: true,
                    min: 0,
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
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    // Get the clicked point's index
                    const index = elements[0].index;
                    const datasetIndex = elements[0].datasetIndex;

                    // Retrieve the clicked dataset and point
                    const clickedDataset =
                        scatterChart.data.datasets[datasetIndex];
                    const clickedPoint = clickedDataset.data[index];

                    // Send the GEOID to the parent component
                    if (clickedPoint && clickedPoint.geoid) {
                        onSelectGEOID(clickedPoint.geoid); // Call the callback with GEOID
                    }
                    console.log(clickedPoint.geoid);
                }
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
    }, [
        loading,
        error,
        precinctData,
        selectedFilter,
        selectedIncomeLevel,
        selectedRegion,
        selectedRace,
        selectedRace2,
    ]);

    const getFormattedRaceName = (race) => {
        if (race === "white") return "White";
        if (race === "black") return "Black";
        if (race === "asian") return "Asian";
        if (race === "hispanic") return "Hispanic";
        if (race === "non_hispanic") return "Non-Hispanic";
        return "Unknown Race";
    };

    const getXAxisTitle = () => {
        if (selectedFilter === "income") return "Annual Income Range ($)";
        if (selectedFilter === "race")
            return `${getFormattedRaceName(selectedRace)} Percentage`;
        if (selectedFilter === "income&race") {
            return `Combined ${getFormattedRaceName(
                selectedRace2
            )} Percentage and Scaled Income`;
        }
        return "X-Axis";
    };

    if (selectedState === States.NONE) {
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
            <>
                <div className="flex items-center mb-4 space-x-4">
                    {/* Dropdown for Income Filter */}
                    <select
                        value={selectedIncomeLevel}
                        onChange={(e) => setSelectedIncomeLevel(e.target.value)}
                        className="border-2 border-black rounded-md p-2"
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
                    {/* Dropdown for Region Type Filter */}
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="border-2 border-black rounded-md p-2"
                    >
                        <option value="all">All Regions</option>
                        <option value="rural">Rural</option>
                        <option value="urban">Urban</option>
                        <option value="suburban">Suburban</option>
                    </select>
                </div>
                {/* <div className="border-2 rounded-xl border-black h-full w-full"> */}
                <div className="h-full w-full">
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                </div>
            </>
        );
    } else if (selectedFilter === "race") {
        return (
            <>
                {/* Render race dropdown if selected filter is race */}
                {selectedFilter === "race" && (
                    <div className="mb-4">
                        <select
                            id="raceFilter"
                            value={selectedRace}
                            onChange={(e) => setSelectedRace(e.target.value)}
                            className="border-2 border-black rounded-md p-2"
                        >
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="asian">Asian</option>
                            <option value="hispanic">Hispanic</option>
                            <option value="non_hispanic">Non-Hispanic</option>
                        </select>
                    </div>
                )}
                {/* <div className="border-2 rounded-xl border-black h-full w-full"> */}
                <div className="h-full w-full">
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                </div>
            </>
        );
    } else if (selectedFilter === "income&race") {
        return (
            <>
                {/* Dropdown for Race Selection */}
                <div className="flex items-center mb-4 space-x-4">
                    <select
                        value={selectedRace2}
                        onChange={(e) => setSelectedRace2(e.target.value)}
                        className="border-2 border-black rounded-md p-2"
                    >
                        <option value="white">White</option>
                        <option value="black">Black</option>
                        <option value="asian">Asian</option>
                        <option value="hispanic">Hispanic</option>
                        <option value="non_hispanic">Non-Hispanic</option>
                    </select>
                </div>
                {/* Chart Container */}
                <div //</>className="border-2 rounded-xl border-black h-full w-full"
                    className="h-full w-full"
                >
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                </div>
                <p className="mt-4 text-sm text-gray-700 text-center">
                    Note: The x-axis represents the combined value of the scaled
                    income and the percentage of the selected race.
                </p>
            </>
        );
    }
};

export default IncomeVotingScatter;
