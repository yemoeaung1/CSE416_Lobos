import { useEffect, useState } from "react";

import UtahFlag from "../assets/us_flags/ut.svg";
import SCarolinaFlag from "../assets/us_flags/sc.svg";

import { retrieveInfo } from "./SimpleClientRequest";

import {
  BsArrowBarLeft,
  BsArrowBarRight,
  BsInfoCircle,
  BsFillBarChartFill,
  BsGraphUp,
  BsMap
} from "react-icons/bs";
import BarGraph from "./barGraph";
import LineGraph from "./lineGraph";
import BoxPlotGraph from "./boxPlotGraph";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IncomeVotingScatter from "./IncomeVotingScatter";

function DataContainer({ isOpen, setIsOpen, selectedArea, selectedState, dataTool, setDataTool, setFilter }) {
  const [dataMapping, setDataMapping] = useState(new Map());

  useEffect(() => {
    if (dataTool === "info") {

      retrieveInfo(selectedState, setDataMapping);

    } else if (dataTool === "data") {

    } else if (dataTool === "gingles") {

    } else if (dataTool === "ensemble") {

    }
  }, [selectedState, dataTool])

  return (
    <div className="data-container">
      {(selectedArea !== "none" || isOpen) && (
        <div
          className={`data-open-button ${isOpen ? "open" : ""}`}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
        </div>
      )}

      <div>
        <DataToolbar
          isOpen={isOpen}
          dataTool={dataTool}
          setDataTool={setDataTool}
        />
        <DataComponent
          isOpen={isOpen}
          dataTool={dataTool}
          selectedArea={selectedArea}
          selectedState={selectedState}
          setFilter={setFilter}
          dataMapping={dataMapping}
        />
      </div>
    </div>
  );
}

function DataToolbar({ isOpen, dataTool, setDataTool }) {
  return (
    <div className={`data-toolbar ${isOpen ? "open" : ""}`}>
      <div
        className={`toolbar-item ${dataTool === "info" ? "tool-selected" : ""}`}
        onClick={() => setDataTool("info")}
      >
        <BsInfoCircle className="toolbar-icon" />
        <span className="toolbar-label">State Info</span>
      </div>

      <div
        className={`toolbar-item ${dataTool === "data" ? "tool-selected" : ""
          }`}
        onClick={() => setDataTool("data")}
      >
        <BsFillBarChartFill className="toolbar-icon" />
        <span className="toolbar-label">Data</span>
      </div>

      <div
        className={`toolbar-item ${dataTool === "gingles" ? "tool-selected" : ""
          }`}
        onClick={() => setDataTool("gingles")}
      >
        <BsGraphUp className="toolbar-icon" />
        <span className="toolbar-label">Gingles</span>
      </div>

      <div
        className={`toolbar-item ${dataTool === "ensemble" ? "tool-selected" : ""
          }`}
        onClick={() => setDataTool("ensemble")}
      >
        <BsMap className="toolbar-icon" />
        <span className="toolbar-label">Ensemble</span>
      </div>
    </div>
  );
}

function DataComponent({ isOpen, dataTool, selectedArea, selectedState, setFilter, dataMapping }) {
  if (!isOpen) {
    return (
      <div className={`data-component ${isOpen ? "open" : ""}`}></div>
    );
  }

  return (
    <div className={`data-component ${isOpen ? "open" : ""}`}>
      {dataTool === "info" && (
        <DataComponent_Info selectedArea={selectedArea} selectedState={selectedState} dataMapping={dataMapping} />
      )}
      {dataTool === "data" && <DataComponent_Data setFilter={setFilter} />}
      {/* {dataTool === "gingles" && (
        <div>
          <IncomeVotingScatter />
        </div>
      )}
       */}
      {dataTool === "gingles" && <DataComponent_Gingles />}
    </div>
  );
}

function DataComponent_Info({ selectedArea, selectedState, dataMapping }) {
  const flagMapping = {
    "Utah": UtahFlag,
    "South Carolina": SCarolinaFlag,
  };

  let party = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Political Party"] : "";
  let population = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Total Population"] : "";
  let income = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Median Household Income"] : "";
  let race = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Majority Race"] : "";

  return (
    <>
      <div className="data-component-info-top p-4">
        <div className="flag-container p-1">
          <img
            src={flagMapping[selectedState]}
            alt="No Flag Found"
            style={{ width: "500px", height: "333px" }}
          />
        </div>
        <div className="data-component-info-right">
          <div
            className="data-component-info-text"
            style={{
              backgroundColor: "rgba(255, 215, 0, 1)",
              flex: 1,
            }}
          >
            <span className="font-bold underline merriweather">Population</span>
            <span className="lato">{`: ${population}`}</span>
          </div>
          <div
            className="data-component-info-text"
            style={{
              backgroundColor: "rgba(180, 180, 180, 0.8)",
              flex: 1,
            }}
          >
            <span className="font-bold underline merriweather">Median Income</span>
            <span className="lato">{`: ${income}`}</span>
          </div>
          <div
            className="data-component-info-text"
            style={{
              backgroundColor: "rgba(220, 220, 220, 0.8)",
              flex: 1,
            }}
          >
            <span className="font-bold underline merriweather">Majority Race</span>
            <span className="lato">{`: ${race}`}</span>
          </div>
          <div
            className="data-component-info-text"
            style={{
              backgroundColor: "rgba(180, 180, 180, 0.8)",
              flex: 1,
            }}
          >
            <span className="font-bold underline merriweather">Party</span>
            <span className="lato">{`: ${party}`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold underline merriweather text-4xl mb-16">Precinct/District/County Data</span>
        <span className="font-bold underline lato text-2xl">{(selectedArea === selectedState) ? "[Select A Precinct/District/County]" : "[Information Goes Here]"}</span>
      </div>
    </>
  );
}

function DataComponent_Data({ setFilter }) {
  const [graphType, setGraphType] = useState("bar");
  const [dataSetType, setDataSetType] = useState("party");

  const handleSwitchChange = (event, type) => {
    if (event.target.checked) {
      setGraphType(type);

      if (type !== "bar" && dataSetType === "party") {
        setDataSetType("race");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex justify-between ">
        <FormControl>
          <FormLabel
            id="demo-row-radio-buttons-group-label"
            sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            Graph Filters:{" "}
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="bar "
              control={
                <Radio
                  checked={graphType === "bar"}
                  onChange={(e) => handleSwitchChange(e, "bar")}
                />
              }
              label="Bar Graph"
            />

            {dataSetType !== "party"  && dataSetType !== "race" && dataSetType !== "income" && dataSetType !== "age" && (
              <>
                <FormControlLabel
                  value="box"
                  control={
                    <Radio
                      checked={graphType === "box"}
                      onChange={(e) => handleSwitchChange(e, "box")}
                    />
                  }
                  label="Box Plot"
                />
                <FormControlLabel
                  value="line"
                  control={
                    <Radio
                      checked={graphType === "line"}
                      onChange={(e) => handleSwitchChange(e, "line")}
                    />
                  }
                  label="Line Graph"
                />
              </>
            )}
          </RadioGroup>
        </FormControl>

        {/*Buttons on the top right corner*/}
        <div className="mt-5">
          {graphType === "bar" && (
            <button
              className={
                dataSetType === "party"
                  ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType("party");
                setFilter("republican");
              }}
            >
              Party{" "}
            </button>
          )}

          <button
            className={
              dataSetType === "race"
                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType("race");
              setFilter("race");
            }}
          >
            Race{" "}
          </button>

          <button
            className={
              dataSetType === "income"
                ? "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType("income");
              setFilter("income");
            }}
          >
            {" "}
            Income{" "}
          </button>

          <button
            className={
              dataSetType === "age"
                ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType("age");
              setFilter("age");
            }}
          >
            {" "}
            Age{" "}
          </button>
        </div>
      </div>

      <div className="h-3/4 w-full">
        {graphType === "bar" && <BarGraph dataSetType={dataSetType} />}
        {graphType === "box" && <BoxPlotGraph dataSetType={dataSetType} />}
        {graphType === "line" && <LineGraph dataSetType={dataSetType} />}
      </div>
    </div>
  );
}

function DataComponent_Gingles() {
  const [selectedChart, setSelectedChart] = useState("precinct-analysis");

  // {graphType === "box" && <BoxPlotGraph />}
  return (
    <div className="flex flex-col h-full">
      {/* Tab Selector */}
      <div className="flex justify-end mb-4 mt-5 space-x-4">
        <button
          className={
            selectedChart === "precinct-analysis"
              ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
              : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
          }
          onClick={() => setSelectedChart("precinct-analysis")}
        >
          Precinct Analysis
        </button>
        {/* 
                {graphType === "line" && <LineGraph />} */}
        <button
          className={
            selectedChart === "ecological-inference"
              ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
              : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
          }
          onClick={() => setSelectedChart("ecological-inference")}
        >
          Ecological Inference
        </button>
      </div>
      {/* Chart Display */}
      <div className="h-3/4 w-full">
        {selectedChart === "precinct-analysis" && <IncomeVotingScatter />}
        {selectedChart === "ecological-inference"}{" "}
        {/* Replace with the other chart component */}
      </div>
    </div>
  );
}

export default DataContainer;
