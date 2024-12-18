import React, { useState, useEffect } from "react";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";
import EcologicalInferenceBarGraph from "./EcologicalInferenceBarGraph";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function EcologicalInferenceTab({ selectedState }) {
  const [filter, setFilter] = useState("race");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedFilterOption1, setSelectedFilterOption1] = useState(null);
  const [selectedFilterOption2, setSelectedFilterOption2] = useState(null);
  const [graphData1, setGraphData1] = useState({republican: null, democratic: null,});
  const [graphData2, setGraphData2] = useState({republican: null, democratic: null,});
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    let options = [];
    if (filter === "race") {
      options = ["White", "Hispanic", "Black", "Asian"];
    } else if (filter === "income") {
      options = ["Low Income", "Medium Income", "High Income"];
    } else if (filter === "region") {
      options = ["Urban", "Suburban", "Rural"];
    }
    setDropdownOptions(options);

    if (options.length > 0) {
      setSelectedFilterOption1(options[0]);
      setSelectedFilterOption2(options[0]);
    }
  }, [filter]);

  useEffect(() => {
    const fetchGraphData = async (filterOption, setGraphData) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/ecological-inference?state=${selectedState}&filter=${filter}&filterOption=${filterOption}`
        );
        const data = response.data;

        setGraphData({
          republican: {
            labels: data.labels,
            dataSets: data.dataSets.filter((ds) =>
              ds.label.includes("Republican")
            ),
          },
          democratic: {
            labels: data.labels,
            dataSets: data.dataSets.filter((ds) =>
              ds.label.includes("Democratic")
            ),
          },
        });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    if (selectedFilterOption1)
      fetchGraphData(selectedFilterOption1, setGraphData1);
    if (selectedFilterOption2)
      fetchGraphData(selectedFilterOption2, setGraphData2);
  }, [selectedState, filter, selectedFilterOption1, selectedFilterOption2]);

  return (
    <div className="flex flex-col w-full h-full">
      <ButtonGroup filter={filter} setFilter={setFilter}/>

      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {chartType === "line" && (
            <>
              <DropDownBar
                label="First Option"
                dropdownOptions={dropdownOptions}
                setSelectedOption={setSelectedFilterOption1}
                selectedOption={selectedFilterOption1}
              />
              <DropDownBar
                label="Second Option"
                dropdownOptions={dropdownOptions}
                setSelectedOption={setSelectedFilterOption2}
                selectedOption={selectedFilterOption2}
              />
            </>
          )}
        </div>

        <button
          className={
            "text-md font-semibold border-2 border-black rounded-xl pl-4 pr-4 hover:bg-blue-200 h-12"
          }
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          Switch to {chartType === "line" ? "Bar Chart" : "Line Chart"}
        </button>
      </div>

      {chartType === "line" ? (
            <>
                {/* Line Graphs for First Selected Option */}
                <div className="flex justify-around mb-8">
                    {graphData1.republican && (
                        <LineGraph
                            graphData={graphData1.republican}
                            title={`Republican Support - ${selectedFilterOption1}`}
                        />
                    )}
                    {graphData1.democratic && (
                        <LineGraph
                            graphData={graphData1.democratic}
                            title={`Democratic Support - ${selectedFilterOption1}`}
                        />
                    )}
                </div>

                {/* Line Graphs for Second Selected Option */}
                <div className="flex justify-around border-t-2 border-gray-200 pt-8">
                    {graphData2.republican && (
                        <LineGraph
                            graphData={graphData2.republican}
                            title={`Republican Support - ${selectedFilterOption2}`}
                        />
                    )}
                    {graphData2.democratic && (
                        <LineGraph
                            graphData={graphData2.democratic}
                            title={`Democratic Support - ${selectedFilterOption2}`}
                        />
                    )}
                </div>
            </>
        ) : (
            <div className="flex justify-center items-center h-full">
                <EcologicalInferenceBarGraph filter={filter} selectedState={selectedState} />
            </div>
        )}
    </div>
  );
}

function DropDownBar({
  label,
  dropdownOptions,
  setSelectedOption,
  selectedOption,
}) {
  return (
    <div>
      <label className="block font-bold mb-1">{label}</label>
      <select
        className="border-2 border-black rounded-md p-2 text-lg w-60"
        value={selectedOption || ""}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {dropdownOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ButtonGroup({ filter, setFilter }) {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        className={`text-md font-semibold border-2 border-black rounded-xl pl-4 pr-4 hover:bg-blue-200 h-10 ${
          filter === "race" ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setFilter("race")}
      >
        Race
      </button>
      <button
        className={`text-sm font-semibold border-2 border-black rounded-xl pl-4 pr-4 hover:bg-blue-200 h-10  ${
          filter === "income" ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setFilter("income")}
      >
        Income
      </button>
      <button
        className={`text-sm font-semibold border-2 border-black rounded-xl pl-4 pr-4 hover:bg-blue-200 h-10  ${
          filter === "region" ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setFilter("region")}
      >
        Region
      </button>
    </div>
  );
}
