import React, { useState, useEffect } from "react";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";

export default function EcologicalInferenceTab({selectedState, filter, filterOption}){
    const [selectedFilter, setSelectedFilter] = useState("race");
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedFilterOption, setSelectedFilterOption] = useState(null);
    const [republicanGraphData, setRepublicanGraphData] = useState(null);
    const [democraticGraphData, setDemocraticGraphData] = useState(null);

    // Fetch data for both Republican and Democratic graphs
    useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/ecological-inference?state=${selectedState}&filter=${filter}&filterOption=${"Hispanic"}`
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

    return(
        <>
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
        </>
    )
}