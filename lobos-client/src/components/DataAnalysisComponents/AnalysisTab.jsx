import React, { useState } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import { FormControlLabel, Checkbox } from "@mui/material";
import LineGraph from "../GraphPlotComponents/LineGraph";

export default function AnalysisTab({ selectedState }) {
    const [selectedChart, setSelectedChart] = useState("precinct-analysis");
    const [selectedFilter, setSelectedFilter] = useState("income");
    const [heatMapEnabled, setHeatMapEnabled] = useState(false);

    // Define styles for tabs
    const tabStyle = {
        cursor: "pointer",
        paddingBottom: "8px",
        marginRight: "16px",
        fontWeight: "bold",
        fontSize: "24px", // Bigger font size
        transition: "color 0.3s ease",
        color: "#6b7280", // Default gray color
        borderBottom: "2px solid transparent",
    };

    const activeTabStyle = {
        ...tabStyle,
        color: "#2563eb", // Active blue color
        borderBottom: "4px solid #2563eb", // Active bottom border
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tab Selector */}
            <nav
                className="flex justify-end mb-4 mt-5 space-x-4 border-b-2 border-gray-300"
                style={{ borderBottom: "2px solid #e5e7eb" }}
            >
                <div
                    style={
                        selectedChart === "precinct-analysis"
                            ? activeTabStyle
                            : tabStyle
                    }
                    onClick={() => setSelectedChart("precinct-analysis")}
                >
                    Precinct Analysis
                </div>
                <div
                    style={
                        selectedChart === "ecological-inference"
                            ? activeTabStyle
                            : tabStyle
                    }
                    onClick={() => setSelectedChart("ecological-inference")}
                >
                    Ecological Inference
                </div>
            </nav>

            {/* Filter Buttons and HeatMap Checkbox */}
            <div className="flex items-center mt-5">
                <div className="flex-grow">
                    <button
                        className={
                            selectedFilter === "income"
                                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("income")}
                    >
                        Income
                    </button>
                    <button
                        className={
                            selectedFilter === "race"
                                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("race")}
                    >
                        Race
                    </button>
                    {selectedChart === "precinct-analysis" && (
                        <button
                        className={
                            selectedFilter === "incomeRace"
                                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("incomeRace")}
                    >
                        Race Income
                    </button>
                    )}
                    

                    {selectedChart === "ecological-inference" && (
                        <button
                        className={
                            selectedFilter === "incomeRace"
                                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("incomeRace")}
                    >
                        Region
                    </button>
                    )}
                </div>
            </div>

            {/* Chart Display */}
            <div className="h-3/4 w-full mt-5">
                {selectedChart === "precinct-analysis" && (
                    <IncomeVotingScatter
                        selectedState={selectedState}
                        selectedFilter={selectedFilter} // Pass the selected filter as a prop
                        heatMapEnabled={heatMapEnabled} // Pass heatMapEnabled as a prop
                    />
                )}
                {selectedChart === "ecological-inference" && (
                    <div>
                        {/* Replace with the other chart component */}
                        Ecological Inference Chart Component (to be added here)
                    </div>
                )}
            </div>
        </div>
    );
}
