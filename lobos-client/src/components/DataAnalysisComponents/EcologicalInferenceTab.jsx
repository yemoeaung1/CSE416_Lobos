import React, { useState, useEffect } from "react";
import LineGraph from "../GraphPlotComponents/LineGraph";
import axios from "axios";
import EcologicalInferenceBarGraph from "./EcologicalInferenceBarGraph";
import { createCustomDropdown } from "../UtilityComponents/CustomDropdown";
import { Box, ButtonGroup, Button} from "@mui/material";

export default function EcologicalInferenceTab({ selectedState }) {
  const [filter, setFilter] = useState("race");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedFilterOption1, setSelectedFilterOption1] = useState("");
  const [selectedFilterOption2, setSelectedFilterOption2] = useState("");
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

    if (selectedFilterOption1) fetchGraphData(selectedFilterOption1, setGraphData1);
    if (selectedFilterOption2) fetchGraphData(selectedFilterOption2, setGraphData2);
  }, [selectedState, filter, selectedFilterOption1, selectedFilterOption2]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between mb-4">
        <EcologicalTypeSelection selectedFilter={filter} setSelectedFilter={setFilter}/>
        <Button className="mr-8"
            sx={{
            textTransform: 'none',
            padding: "4px 8px",
            minHeight: "24px",
            fontSize: "1.0rem",
            fontFamily: "Montserrat, san-serif",
            color: "#37474f",
            "&:hover": {
                backgroundColor: "grey.300",
            },
          }}
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}>
              Click for {chartType === "line" ? "Bar Chart" : "Line Chart"}
        </Button> 
        
      </div>
      <div className="flex justify-between space-x-4 mb-4">
          {chartType === "line" && (
            <>
              {createCustomDropdown("First Option", "first-option", selectedFilterOption1, setSelectedFilterOption1, dropdownOptions.map((option) => ({ text: option, value: option })))}      
              {createCustomDropdown("Second Option", "first-option", selectedFilterOption2, setSelectedFilterOption1, dropdownOptions.map((option) => ({ text: option, value: option }))
)}                    
          </>
          )}
        </div>

      {chartType === "line" ? (
            <>
                {/* Line Graphs for First Selected Option */}
                <div className="flex justify-around mb-2">
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
                <div className="flex justify-around border-t-2 border-gray-200 pt-2">
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

function EcologicalTypeSelection({ selectedFilter, setSelectedFilter }) {
  const filterOptions = [
      { text: "Income", value: "income" },
      { text: "Racial/Ethnic", value: "race" },
      { text: "Region", value: "region" }
  ]

  return (
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, marginBottom: "4px"}}>
          <ButtonGroup
              variant="contained"
              aria-label="linked button group"
              orientation="horizontal"
          >
              {filterOptions.map((element) => (
                  <EcologicalTypeButton
                      key={element}
                      selectedElement={selectedFilter}
                      setSelectedElement={setSelectedFilter}
                      buttonType={element}
                  />
              ))}
          </ButtonGroup>
      </Box>
  );
}

function EcologicalTypeButton({ selectedElement, setSelectedElement, buttonType }) {
  const isButtonSelected = (selectedElement === buttonType.value);

  return (
      <Button
          onClick={() => setSelectedElement(buttonType.value)}
          sx={{
              textTransform: 'none',
              padding: "4px 12px",
              minHeight: "32px",
              fontSize: "1.0rem",
              fontFamily: "Montserrat, san-serif",
              backgroundColor: isButtonSelected ? "primary.main" : "grey.200",
              color: isButtonSelected ? "grey.200" : "primary.main",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                  backgroundColor: isButtonSelected ? "primary.dark" : "grey.300",
              },
          }}
      >
          {buttonType.text}
      </Button>
  );
}