import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
// Test commit
const IncomeVotingScatter = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        // Used sample data
        const democratData = [
            { x: 10500, y: 68 },
            { x: 12084, y: 66 },
            { x: 13894, y: 64 },
            { x: 14300, y: 66 },
            { x: 15982, y: 63 },
            { x: 18370, y: 61 },
            { x: 19800, y: 64 },
            { x: 21144, y: 59 },
            { x: 24300, y: 58 },
            { x: 25200, y: 63 },
            { x: 27970, y: 56 },
            { x: 30750, y: 61 },
            { x: 32130, y: 54 },
            { x: 35500, y: 58 },
            { x: 37040, y: 53 },
            { x: 40200, y: 56 },
            { x: 42590, y: 51 },
            { x: 46700, y: 55 },
            { x: 48970, y: 49 },
            { x: 50900, y: 53 },
            { x: 56360, y: 48 },
            { x: 61500, y: 51 },
            { x: 64800, y: 46 },
            { x: 70900, y: 48 },
            { x: 74570, y: 44 },
            { x: 80400, y: 46 },
            { x: 85700, y: 43 },
            { x: 89000, y: 43 },
            { x: 98650, y: 41 },
            { x: 100500, y: 41 },
            { x: 113610, y: 39 },
            { x: 118000, y: 39 },
            { x: 130540, y: 38 },
            { x: 139000, y: 36 },
            { x: 150450, y: 36 },
            { x: 157000, y: 34 },
            { x: 172830, y: 34 },
            { x: 178000, y: 32 },
            { x: 192000, y: 30 },
            { x: 195000, y: 29 },
            { x: 23560, y: 62 },
            { x: 24530, y: 64 },
            { x: 25980, y: 61 },
            { x: 26920, y: 63 },
            { x: 28570, y: 57 },
            { x: 29350, y: 65 },
            { x: 31040, y: 54 },
            { x: 32550, y: 60 },
            { x: 33600, y: 55 },
            { x: 34900, y: 59 },
            { x: 36420, y: 52 },
            { x: 37900, y: 58 },
            { x: 39310, y: 64 },
            { x: 41000, y: 53 },
            { x: 42870, y: 55 },
            { x: 44000, y: 51 },
            { x: 45500, y: 63 },
            { x: 47420, y: 58 },
            { x: 49300, y: 60 },
            { x: 50860, y: 57 },
            { x: 60000, y: 45 },
            { x: 63158, y: 44 },
            { x: 66316, y: 40 },
            { x: 69474, y: 40 },
            { x: 72632, y: 42 },
            { x: 75790, y: 42 },
            { x: 78948, y: 41 },
            { x: 82106, y: 45 },
            { x: 85264, y: 40 },
            { x: 88422, y: 39 },
            { x: 91580, y: 33 },
            { x: 94738, y: 38 },
            { x: 97896, y: 34 },
            { x: 101054, y: 40 },
            { x: 104212, y: 37 },
            { x: 107370, y: 34 },
            { x: 110528, y: 36 },
            { x: 113686, y: 35 },
            { x: 116844, y: 35 },
            { x: 120002, y: 34 },
            { x: 131000, y: 37 },
            { x: 133500, y: 39 },
            { x: 136000, y: 35 },
            { x: 138500, y: 38 },
            { x: 141000, y: 36 },
            { x: 143500, y: 34 },
            { x: 146000, y: 39 },
            { x: 148500, y: 33 },
            { x: 151000, y: 31 },
            { x: 153500, y: 34 },
            { x: 156000, y: 29 },
            { x: 158500, y: 32 },
            { x: 161000, y: 38 },
            { x: 163500, y: 31 },
            { x: 166000, y: 33 },
        ];

        const republicanData = [
            { x: 10500, y: 32 },
            { x: 12084, y: 34 },
            { x: 13894, y: 36 },
            { x: 14300, y: 34 },
            { x: 15982, y: 38 },
            { x: 18370, y: 40 },
            { x: 19800, y: 37 },
            { x: 21144, y: 42 },
            { x: 24300, y: 45 },
            { x: 25200, y: 39 },
            { x: 27970, y: 47 },
            { x: 30750, y: 42 },
            { x: 32130, y: 49 },
            { x: 35500, y: 44 },
            { x: 37040, y: 51 },
            { x: 40200, y: 46 },
            { x: 42590, y: 53 },
            { x: 46700, y: 49 },
            { x: 48970, y: 55 },
            { x: 50900, y: 51 },
            { x: 56360, y: 57 },
            { x: 61500, y: 53 },
            { x: 64800, y: 59 },
            { x: 70900, y: 56 },
            { x: 74570, y: 62 },
            { x: 80400, y: 59 },
            { x: 85700, y: 64 },
            { x: 89000, y: 61 },
            { x: 98650, y: 66 },
            { x: 100500, y: 63 },
            { x: 113610, y: 68 },
            { x: 118000, y: 65 },
            { x: 130540, y: 70 },
            { x: 139000, y: 67 },
            { x: 150450, y: 72 },
            { x: 157000, y: 70 },
            { x: 172830, y: 74 },
            { x: 178000, y: 73 },
            { x: 190000, y: 72 },
            { x: 195000, y: 71 },
            { x: 23850, y: 39 },
            { x: 24930, y: 45 },
            { x: 26720, y: 42 },
            { x: 27580, y: 50 },
            { x: 28910, y: 44 },
            { x: 30050, y: 50 },
            { x: 31520, y: 53 },
            { x: 32860, y: 49 },
            { x: 34140, y: 41 },
            { x: 35600, y: 53 },
            { x: 36750, y: 48 },
            { x: 38100, y: 54 },
            { x: 39520, y: 51 },
            { x: 40900, y: 48 },
            { x: 42030, y: 45 },
            { x: 43550, y: 52 },
            { x: 44890, y: 48 },
            { x: 46250, y: 44 },
            { x: 47720, y: 53 },
            { x: 49230, y: 49 },
            { x: 60000, y: 55 },
            { x: 63158, y: 56 },
            { x: 66316, y: 57 },
            { x: 69474, y: 57 },
            { x: 72632, y: 58 },
            { x: 75790, y: 61 },
            { x: 78948, y: 59 },
            { x: 82106, y: 65 },
            { x: 85264, y: 60 },
            { x: 88422, y: 62 },
            { x: 91580, y: 61 },
            { x: 94738, y: 58 },
            { x: 97896, y: 62 },
            { x: 101054, y: 63 },
            { x: 104212, y: 59 },
            { x: 107370, y: 64 },
            { x: 110528, y: 60 },
            { x: 113686, y: 65 },
            { x: 116844, y: 58 },
            { x: 120002, y: 66 },
            { x: 131000, y: 69 },
            { x: 133500, y: 71 },
            { x: 136000, y: 68 },
            { x: 138500, y: 70 },
            { x: 141000, y: 72 },
            { x: 143500, y: 69 },
            { x: 146000, y: 71 },
            { x: 148500, y: 73 },
            { x: 151000, y: 68 },
            { x: 153500, y: 70 },
            { x: 156000, y: 80 },
            { x: 158500, y: 72 },
            { x: 161000, y: 65 },
            { x: 163500, y: 75 },
            { x: 166000, y: 72 },
            { x: 124000, y: 72 },
            { x: 125878, y: 65 },
        ];

        // Scaling factor for x-values
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

        // Compute min and max x-values from the original data
        const allXValues = [...democratData, ...republicanData].map(
            (point) => point.x
        );
        const minX = Math.min(...allXValues);
        const maxX = Math.max(...allXValues);

        // Define a step size for generating 100 points
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
                    data: regressionDataDemocrat, // Regression line data with original x-values
                    borderColor: "rgba(0, 0, 255, 1)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    tooltip: { enabled: true },
                    hoverRadius: 1,
                },
                {
                    type: "line",
                    label: "Republican Regression Line",
                    data: regressionDataRepublican, // Regression line data with original x-values
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    tooltip: { enabled: true },
                    hoverRadius: 1,
                },
            ],
        };

        const scatterOptions = {
            responsive: true,
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
                    text: "Voting Trends by Income",
                    font: {
                        size: 30,
                        weight: "bold",
                    },
                },
                tooltip: {
                    // Customize tooltip to show formatted x-values
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

        const scatterChart = new Chart(ctx, {
            type: "scatter",
            data: chartData,
            options: scatterOptions,
        });

        return () => {
            scatterChart.destroy();
        };
    }, []);

    return (
        <div className="border-2 rounded-xl border-black">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
    );
};

export default IncomeVotingScatter;
