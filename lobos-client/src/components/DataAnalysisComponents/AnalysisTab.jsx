import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import PrecinctDataTable from "../GraphPlotComponents/PrecinctDataTable";
import VoteShareSeatShareGraph from "../GraphPlotComponents/VoteShareSeatShareGraph";
import { FormControlLabel, Checkbox } from "@mui/material";
import { MapViewOptions } from "../../enums";
import LineGraph from "../GraphPlotComponents/LineGraph";
import EcologicalInferenceTab from "./EcologicalInferenceTab";
import axios from "axios";
import { Tooltip } from "@mui/material";

export default function AnalysisTab({ selectedState, mapView, setMapView }) {
  const [selectedChart, setSelectedChart] = useState("precinct-analysis");
  const [selectedFilter, setSelectedFilter] = useState("income");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(null);

  // Update dropdown options based on selected filter
  useEffect(() => {
    if (selectedFilter === "income") {
      setDropdownOptions(["Low Income", "Middle Income", "High Income"]);
    } else if (selectedFilter === "race") {
      setDropdownOptions(["White", "Black", "Hispanic", "Asian"]);
    } else {
      setDropdownOptions([]);
    }
  }, [selectedFilter]);
    const [showTable, setShowTable] = useState(false); // For toggling the table
    const [selectedGEOID, setSelectedGEOID] = useState(null); // GEOID of selected point
    const [precinctData, setPrecinctData] = useState([]); // Store fetched precinct data
    const [selectedAdditionalView, setSelectedAdditionalView] = useState(null);
    // Check if curve graph option should be disabled
    const isCurveDisabled = selectedState === "Utah";

    useEffect(() => {
        if (mapView != MapViewOptions.PRECINCT)
            setMapView(MapViewOptions.PRECINCT);
    }, []);

    // Define styles for tabs
    const tabStyle = {
        cursor: "pointer",
        paddingBottom: "4px",
        marginRight: "8px",
        fontSize: "16px",
        transition: "color 0.3s ease",
        color: "#6b7280",
        borderBottom: "2px solid transparent",
    };

    const activeTabStyle = {
        ...tabStyle,
        color: "#2563eb",
        borderBottom: "4px solid #2563eb",
    };

    return (
      <div className=".data-component-container">
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
                                    ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                                    : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                            }
                            onClick={() => setSelectedFilter("income")}
                        >
                            Income
                        </button>
                        <button
                            className={
                                selectedFilter === "race"
                                    ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                                    : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                            }
                            onClick={() => setSelectedFilter("race")}
                        >
                            Racial/Ethnic
                        </button>
                        <button
                            className={
                                selectedFilter === "income&race"
                                    ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                                    : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                            }
                            onClick={() => setSelectedFilter("income&race")}
                        >
                            Income & Race
                        </button>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                        <button
                            onClick={() => {
                                setSelectedAdditionalView(
                                    selectedAdditionalView === "table"
                                        ? null
                                        : "table"
                                ),
                                    (setShowTable(true));
                            }}
                            className={`text-sm font-semibold p-2 rounded-md ${selectedAdditionalView === "table"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            Show Table
                        </button>
                        <Tooltip
                            title={
                                isCurveDisabled
                                    ? "Curve graph is disabled for this state."
                                    : ""
                            }
                            placement="top"
                            arrow
                        >
                            <span>
                                <button
                                    onClick={() =>
                                        setSelectedAdditionalView(
                                            selectedAdditionalView === "curve"
                                                ? null
                                                : "curve"
                                        )
                                    }
                                    className={`text-sm font-semibold p-2 rounded-md ${selectedAdditionalView === "curve"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    disabled={isCurveDisabled}
                                >
                                    Show Curve Graph
                                </button>
                            </span>
                        </Tooltip>
                    </div>
                </div>

                {/* Chart Display */}
                <div
                    className={`transition-all duration-300 ${(selectedAdditionalView === "table" ||
                        selectedAdditionalView === "curve") &&
                        selectedChart === "precinct-analysis"
                        ? "h-2/4"
                        : "h-3/4"
                        } w-full mt-5`}
                    style={{
                        paddingBottom: showTable ? "10px" : "10px", // Add extra space when the table is shown
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
                            <EcologicalInferenceTab selectedState={selectedState}/>
                        </div>
                    )}
                </div>
                {/* Table Display */}
                {selectedChart === "precinct-analysis" &&
                    selectedAdditionalView === "table" && (
                        <div
                            className="flex-grow w-full overflow-hidden mt-6"
                            style={{
                                paddingTop: "20px", // Additional spacing above the table
                            }}
                        >
                            <PrecinctDataTable
                                precinctData={precinctData}
                                selectedGEOID={selectedGEOID}
                            />
                        </div>
                    )}
                {selectedChart === "precinct-analysis" &&
                    selectedAdditionalView === "curve" &&
                    !isCurveDisabled && (
                        <div
                            className="flex-grow w-full overflow-hidden mt-6"
                            style={{
                                paddingTop: "20px", // Additional spacing above the table
                            }}
                        >
                            <VoteShareSeatShareGraph
                                selectedState={selectedState}
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}
