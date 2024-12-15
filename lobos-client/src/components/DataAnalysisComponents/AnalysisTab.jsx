import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import { FormControlLabel, Checkbox } from "@mui/material";
import { MapViewOptions } from "../../enums";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";

export default function AnalysisTab({ selectedState, mapView, setMapView }) {
  const [selectedChart, setSelectedChart] = useState("precinct-analysis");
  const [selectedFilter, setSelectedFilter] = useState("income");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(null);
  const [republicanGraphData, setRepublicanGraphData] = useState(null);
  const [democraticGraphData, setDemocraticGraphData] = useState(null);

  // Fetch data for both Republican and Democratic graphs
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/ecological-inference?state=${selectedState}&filter=${"race"}&filterOption=${"White"}`
        );

        const data = response.data;
        console.log(data);
        // Separate Republican and Democratic datasets
        setRepublicanGraphData({
          labels: data.labels,
          dataSets: data.dataSets.filter((ds) =>
            ds.label.includes("Republican")
          ),
        });

        console.log(republicanGraphData);

        setDemocraticGraphData({
          labels: data.labels,
          dataSets: data.dataSets.filter((ds) =>
            ds.label.includes("Democratic")
          ),
        });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, [selectedState]);

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

      {/* Dropdown Menu */}
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
      )}

      {/* Chart Display */}
      <div className="h-3/4 w-full mt-5">
        {selectedChart === "precinct-analysis" && (
          <IncomeVotingScatter
            selectedState={selectedState}
            selectedFilter={selectedFilter} // Pass the selected filter as a prop
          />
        )}
        {selectedChart === "ecological-inference" && (
          <div className="space-y-6 flex flex-col w-full h-full">
            {republicanGraphData && (
              <div className="h-1/2 w-full flex justify-center items-center">
                <LineGraph
                  graphData={republicanGraphData}
                  title="Support for Republican Candidates"
                />
              </div>
            )}
            {democraticGraphData && (
              <div className="h-1/2 w-full flex justify-center items-center">
                <LineGraph
                  graphData={democraticGraphData}
                  title="Support for Democratic Candidates"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
