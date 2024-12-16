import React, { useState, useEffect } from "react";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";

export default function EcologicalInferenceTab({selectedState, filter}){
    const [selectedFilter, setSelectedFilter] = useState("race");
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedFilterOption, setSelectedFilterOption] = useState("Medium Income");
    const [republicanGraphData, setRepublicanGraphData] = useState(null);
    const [democraticGraphData, setDemocraticGraphData] = useState(null);

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
          `http://localhost:8080/api/ecological-inference?state=${selectedState}&filter=${filter}&filterOption=${selectedFilterOption}`
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
            <DropDownBar dropdownOptions={dropdownOptions} setSelectedFilterOption={setSelectedFilterOption} selectedFilterOption={selectedFilterOption} />
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
        </div>
    )
}

function DropDownBar({dropdownOptions, setSelectedFilterOption, selectedFilterOption}){
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