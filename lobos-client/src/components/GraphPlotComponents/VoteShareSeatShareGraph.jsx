import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const VoteShareSeatShareGraph = ({ selectedState }) => {
    const chartRef = useRef(null);
    const [voteSeatData, setVoteSeatData] = useState([]); // State to store API data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchVoteSeatData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/vote-seat-curve?state=${selectedState}`
                );
                const data = await response.json();
                setVoteSeatData(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchVoteSeatData();
    }, [selectedState]);

    // Render chart when data is available
    useEffect(() => {
        if (!voteSeatData.length || error || loading) return;

        const chartData = {
            datasets: [
                {
                    label: "Republican Seat Share",
                    data: voteSeatData.map((item) => ({
                        x: item.republican_vote_share,
                        y: item.republican_seat_share,
                    })),
                    borderColor: "rgba(255, 0, 0, 1)",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                    showLine: true,
                    pointRadius: 5,
                },
                {
                    label: "Democratic Seat Share",
                    data: voteSeatData.map((item) => ({
                        x: item.democratic_vote_share,
                        y: item.democratic_seat_share,
                    })),
                    borderColor: "rgba(0, 0, 255, 1)",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                    showLine: true,
                    pointRadius: 5,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: "Vote Share (%)" },
                    ticks: {
                        callback: (value) => `${value.toFixed(2)}%`,
                    },
                },
                y: {
                    title: { display: true, text: "Seat Share (%)" },
                    ticks: {
                        callback: (value) => `${value.toFixed(2)}%`,
                    },
                },
            },
            plugins: {
                legend: { position: "top" },
                title: {
                    display: true,
                    text: "Vote Share vs Seat Share Curve",
                    color: "#000000",
                    font: { size: 18, weight: "bold" },
                },
            },
        };

        const ctx = chartRef.current.getContext("2d");
        const chartInstance = new Chart(ctx, {
            type: "scatter",
            data: chartData,
            options: chartOptions,
        });

        return () => chartInstance.destroy();
    }, [voteSeatData, error, loading]);

    if (loading) return <div>Loading graph...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="h-full w-full">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default VoteShareSeatShareGraph;
