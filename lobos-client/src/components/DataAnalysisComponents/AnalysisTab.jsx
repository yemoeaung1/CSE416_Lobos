import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import { FormControlLabel, Checkbox } from "@mui/material";
import { MapViewOptions } from "../../enums";
import LineGraph from "../GraphPlotComponents/LineGraph";
import EcologicalInferenceTab from "./EcologicalInferenceTab";
import axios from "axios";

export default function AnalysisTab({ selectedState, mapView, setMapView }) {
  const [selectedChart, setSelectedChart] = useState("precinct-analysis");
  const [selectedFilter, setSelectedFilter] = useState("race");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(null);
  const [republicanGraphData, setRepublicanGraphData] = useState(null);
  const [democraticGraphData, setDemocraticGraphData] = useState(null);

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

  useEffect(() => {
    if (mapView != MapViewOptions.PRECINCT) setMapView(MapViewOptions.PRECINCT);
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
            selectedChart === "precinct-analysis" ? activeTabStyle : tabStyle
          }
          onClick={() => setSelectedChart("precinct-analysis")}
        >
          Gingles 2/3
        </div>
        <div
          style={
            selectedChart === "ecological-inference" ? activeTabStyle : tabStyle
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
              selectedFilter === "incomeRace"
                ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => setSelectedFilter("incomeRace")}
          >
            ..
          </button>
        </div>
      </div>

      {/* Dropdown Menu
      {dropdownOptions.length > 0 && (
        <div className="mt-4">
          <select
            className="text-lg border-2 border-gray-300 rounded-md p-2"
            value={selectedDropdownOption || ""}
            onChange={(e) => setSelectedDropdownOption(e.target.value)}
          >
            <option value="" disabled>
              Select an option
            </option>
            {dropdownOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )} */}

      {/* Chart Display */}
      <div className="h-3/4 w-full mt-5">
        {selectedChart === "precinct-analysis" && (
          <IncomeVotingScatter
            selectedState={selectedState}
            selectedFilter={selectedFilter} // Pass the selected filter as a prop
          />
        )}
        {selectedChart === "ecological-inference" && (
          <>
            <EcologicalInferenceTab selectedState={selectedState} filter={selectedFilter} filterOption={selectedDropdownOption}/>
          </>
        )}
      </div>
    </div>
  );
}
