import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
import axios from "axios";
import { States } from "../../enums";
import { createCustomDropdown } from "../UtilityComponents/CustomDropdown";

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
        // Reset income level and region filter when switching to Income & Race or Race tab
        if (selectedFilter !== "income") {
            setSelectedIncomeLevel("all");
            setSelectedRegion("all");
        }
        const chartData = {
            datasets: [
                {
                    label: "Democratic Voters",
                    data: democratData,
                    backgroundColor: "rgba(0, 0, 255, 1)",
                    //borderColor: "rgba(0, 0, 255, 1)",
                    //borderWidth: 1,
                    pointRadius: 2,
                    showLine: false,
                },
                {
                    label: "Republican Voters",
                    data: republicanData,
                    backgroundColor: "rgba(255, 0, 0, 1)",
                    //borderColor: "rgba(255, 0, 0, 1)",
                    //borderWidth: 1,
                    pointRadius: 2,
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
                if (selectedState === "Utah") {
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
                } else if (selectedState === "South Carolina") {
                    switch (selectedRace2) {
                        case "white":
                            return { min: 0, max: 160 };
                        case "black":
                            return { min: 20, max: 100 };
                        case "asian":
                            return { min: 0, max: 110 };
                        case "hispanic":
                            return { min: 0, max: 100 };
                        case "non_hispanic":
                            return { min: 40, max: 160 };
                        default:
                            return { min: 0, max: 175 };
                    }
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
                            size: 16,
                            weight: "bold",
                            color: "#000000",
                            family: "Montserrat, san-serif",
                        },
                    },
                    ...getXAxisRange(),
                    //min: selectedFilter === "race" ? 0 : minX, // Set to 0 for race
                    //max: selectedFilter === "race" ? 100 : maxX, // Set to 100 for race
                    ticks: {
                        callback: function (value) {
                            return `${value.toLocaleString()}${selectedFilter === "race" ? "%" : ""
                                }`;
                        },
                        font: {
                            size: 12,
                            family: "Montserrat, san-serif",
                        },
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
                            size: 16,
                            family: "Montserrat, san-serif",
                        },
                    },
                    ticks: {
                        callback: function (value) {
                            return `${value}%`;
                        },
                        font: {
                            size: 12,
                            family: "Montserrat, san-serif",
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: {
                            family: "Montserrat, san-serif",
                        },
                    },
                },
                title: {
                    display: true,
                    text: getChartTitle(),
                    color: "#000000",
                    font: {
                        size: 24,
                        weight: "bold",
                        family: "Montserrat, san-serif",
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
                                const yValue = context.parsed.y.toFixed(2);
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
        if (selectedFilter === "income") return "Annual Household Income ($)";
        if (selectedFilter === "race")
            return `${getFormattedRaceName(selectedRace)} Percentage (%)`;
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

    return (
        <>
            {selectedFilter === "income" &&
                <div className="flex items-center mb-4 space-x-4">
                    {/* Dropdown for Income Filter */}
                    {createCustomDropdown("Income Ranges", "gingles-dropdown-label", selectedIncomeLevel, setSelectedIncomeLevel, [
                        { text: "All Incomes", value: "all" },
                        { text: "Low Income (Below $50,000)", value: "low" },
                        { text: "Medium Income ($50,000 - $100,000)", value: "medium" },
                        { text: "High Income (Above $100,000)", value: "high" }
                    ])}

                    {/* Dropdown for Region Type Filter */}
                    {createCustomDropdown("Region Types", "gingles-dropdown-label", selectedRegion, setSelectedRegion, [
                        { text: "All Regions", value: "all" },
                        { text: "Urban", value: "urban" },
                        { text: "Suburban", value: "suburban" },
                        { text: "Rural", value: "rural" }
                    ])}
                </div>
            }
            {selectedFilter === "race" &&
                <>
                    {/* Dropdown for Race Filter */}
                    {createCustomDropdown("Races", "gingles-dropdown-label", selectedRace, setSelectedRace, [
                        { text: "White", value: "white" },
                        { text: "Black", value: "black" },
                        { text: "Asian", value: "asian" },
                        { text: "Hispanic", value: "hispanic" },
                        { text: "Non-Hispanic", value: "non_hispanic" }
                    ])}
                </>
            }

            {selectedFilter === "income&race" &&
                <>
                    {/* Dropdown for Race Filter */}
                    {createCustomDropdown("Races", "gingles-dropdown-label", selectedRace2, setSelectedRace2, [
                        { text: "White", value: "white" },
                        { text: "Black", value: "black" },
                        { text: "Asian", value: "asian" },
                        { text: "Hispanic", value: "hispanic" },
                        { text: "Non-Hispanic", value: "non_hispanic" }
                    ])}
                    <p className="mt-1 text-xs text-gray-700 text-center">
                        Note: The x-axis represents the combined value of the scaled
                        income and the percentage of the selected race.
                    </p>
                </>
            }

            <div className="h-full w-full">
                <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
        </>
    )
};

export default IncomeVotingScatter;
