import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import PrecinctDataTable from "../GraphPlotComponents/PrecinctDataTable";
import { FormControlLabel, Checkbox } from "@mui/material";
import { MapViewOptions } from "../../enums";

export default function AnalysisTab({ selectedState, setMapView }) {
    const [selectedChart, setSelectedChart] = useState("precinct-analysis");
    const [selectedFilter, setSelectedFilter] = useState("income");
    const [showTable, setShowTable] = useState(false); // For toggling the table
    const [selectedGEOID, setSelectedGEOID] = useState(null); // GEOID of selected point
    const [precinctData, setPrecinctData] = useState([]); // Store fetched precinct data

    useEffect(() => {
        setMapView(MapViewOptions.PRECINCT);
    }, []);

    // Define styles for tabs
    const tabStyle = {
        cursor: "pointer",
        paddingBottom: "8px",
        marginRight: "16px",
        fontWeight: "bold",
        fontSize: "20px", // Bigger font size
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
                className="flex justify-end mb-4 space-x-8 border-b-2 border-gray-300"
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
                    Gingles 2/3
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

            {/* Filter Buttons */}
            <div className="flex items-center">
                <div className="flex-grow">
                    <button
                        className={
                            selectedFilter === "income"
                                ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("income")}
                    >
                        Income
                    </button>
                    <button
                        className={
                            selectedFilter === "race"
                                ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("race")}
                    >
                        Racial/Ethnic
                    </button>
                    <button
                        className={
                            selectedFilter === "income&race"
                                ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                        }
                        onClick={() => setSelectedFilter("income&race")}
                    >
                        Income & Race
                    </button>
                </div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showTable}
                            onChange={(e) => setShowTable(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Show Table"
                    className="ml-4"
                />
            </div>

            {/* Chart Display */}
            <div
                className={`transition-all duration-300 ${
                    showTable && selectedChart === "precinct-analysis"
                        ? "h-2/4"
                        : "h-3/4"
                } w-full mt-5`}
                style={{
                    paddingBottom: showTable ? "40px" : "10px", // Add extra space when the table is shown
                }}
            >
                {selectedChart === "precinct-analysis" && (
                    <IncomeVotingScatter
                        selectedState={selectedState}
                        selectedFilter={selectedFilter}
                        onSelectGEOID={setSelectedGEOID} // Get selected GEOID from scatter plot
                        onPrecinctDataFetched={setPrecinctData} // Get precinct data
                    />
                )}
                {selectedChart === "ecological-inference" && (
                    <div>
                        {/* Replace with the other chart component */}
                        Ecological Inference Chart Component (to be added here)
                    </div>
                )}
            </div>
            {/* Table Display */}
            {selectedChart === "precinct-analysis" && showTable && (
                <PrecinctDataTable
                    precinctData={precinctData}
                    selectedGEOID={selectedGEOID} // Pass selected GEOID to the table
                />
            )}
        </div>
    );
}
