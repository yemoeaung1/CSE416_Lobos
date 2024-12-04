import React, { useState } from "react";
import { 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Checkbox} from '@mui/material';

import BarGraph from "../GraphPlotComponents/BarGraph";

export default function StateDataTab({ setFilter, selectedState}) {
    const [graphType, setGraphType] = useState("bar");
    const [dataSetType, setDataSetType] = useState("race");
    const [heatMapEnabled, setHeatMapEnabled] = useState(false);

  
    // const handleSwitchChange = (event, type) => {
    //   if (event.target.checked) {
    //     setGraphType(type);
  
    //     if (type !== "bar" && dataSetType === "party") {
    //       setDataSetType("race");
    //     }
    //   }
    // };

    //Enables the Heat Map
    const handleHeatMapChange = (event) => {
      setHeatMapEnabled(event.target.checked);
      console.log("HeatMap Enabled:", event.target.checked);
    };
  
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8 flex justify-between ">
          {/* <FormControl> */}
            {/* <FormLabel
              id="demo-row-radio-buttons-group-label"
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Graph Filters:{" "}
            </FormLabel> */}
{/* 
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
  
              {dataSetType !== "party" && dataSetType !== "race" && dataSetType !== "income" && (
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
          </FormControl> */}
  
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
                  // setFilter("republican");
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
                // setFilter("race");
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
                // setFilter("income");
              }}
            >
              {" "}
              Income{" "}
            </button>

            <button
              className={
                dataSetType === "region"
                  ? "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType("region");
                // setFilter("region");
              }}
            >
              {" "}
              Region Type{" "}
            </button>  

          </div>

          {/* Checkbox for HeatMap */}
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={heatMapEnabled}
                  onChange={handleHeatMapChange}
                  sx={{
                    "&.Mui-checked": {
                      color: "#42a5f5",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 28,
                    },
                  }}
                />
              }
              label={<span className="text-2xl font-semibold">Enable HeatMap</span>}
            />
          </div>
        </div>

        <div className="h-3/4 w-full">
          {graphType === "bar" && <BarGraph dataSetType={dataSetType} selectedState={selectedState} />}
          {/* {graphType === "box" && <BoxPlotGraph dataSetType={dataSetType} />}
          {graphType === "line" && <LineGraph dataSetType={dataSetType} />} */}
          <div className="text-3xl font-bold text-center mt-8 font-roboto">Total Population:  
            <span className="text-2xl font-normal"> 17208174082734982307</span></div>
        
        </div>
      </div>
    );
  }