import React, { useState, useEffect } from "react";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";
import EcologicalInferenceBarGraph from "./EcologicalInferenceBarGraph";

export default function EcologicalInferenceTab({selectedState, filter}){
    const [selectedFilter, setSelectedFilter] = useState("race");
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedFilterOption, setSelectedFilterOption] = useState("White");
    const [regionOptions] = useState(["Urban", "Suburban", "Rural"]);
    const [selectedRegion, setSelectedRegion] = useState("Urban");
    const [republicanGraphData, setRepublicanGraphData] = useState(null);
    const [democraticGraphData, setDemocraticGraphData] = useState(null);
    const [chartType, setChartType] = useState("line");

    useEffect(() => {
        if (filter === "race") {
            setDropdownOptions(["White", "Hispanic", "Black", "Asian"]);
        } 
        else if (filter === "income") {
            setDropdownOptions(["Low Income", "Medium Income", "High Income"]);
        }
    }, [filter]);

    // Fetch data for both Republican and Democratic graphs
    useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/ecological-inference?state=${selectedState}&filter=${"race"}&filterOption=${"White"}`
        );

        const data = response.data;
        // Separate Republican and Democratic datasets
        setRepublicanGraphData({
          labels: data.labels,
          dataSets: data.dataSets.filter((ds) =>
            ds.label.includes("Republican")
          ),
        });

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
  }, [selectedState, filter, selectedFilterOption]);

    return(
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <DropDownBar label="Filter Option"
            dropdownOptions={dropdownOptions}
            setSelectedOption={setSelectedFilterOption}
            selectedOption={selectedFilterOption}
          />
          <DropDownBar
            label="Region Type"
            dropdownOptions={regionOptions}
            setSelectedOption={setSelectedRegion}
            selectedOption={selectedRegion}
          />
        </div>

        <button
          className="text-sm font-semibold bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          Switch to {chartType === "line" ? "Bar Chart" : "Line Chart"}
        </button>
      </div>

      {chartType === "line" ? (
        <>
          {republicanGraphData && (
            <div className="h-1/2 w-full flex justify-center items-center">
              <LineGraph
                graphData={republicanGraphData}
                title="Support for Republican"
              />
            </div>
          )}
          {democraticGraphData && (
            <div className="h-1/2 w-full flex justify-center items-center">
              <LineGraph
                graphData={democraticGraphData}
                title="Support for Democrat"
              />
            </div>
          )}
        </>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <EcologicalInferenceBarGraph
            dataSetType={"race"}
            selectedState={selectedState}
          />
        </div>
      )}
        </div>
    )
}

function DropDownBar({label, dropdownOptions, setSelectedFilterOption, selectedFilterOption}){
    return(
        <div>
            <div className="mb-4 flex justify-start items-center">
                <select
                    className="border-2 border-gray-300 rounded-md p-2 text-lg"
                    value={selectedFilterOption}
                    onChange={(e) => setSelectedFilterOption(e.target.value)}
                    
                >
                    {dropdownOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
        </div>
    </div>
    )
}