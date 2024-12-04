<<<<<<< HEAD
export default function StateDataTab({ setFilter }) {
    const [graphType, setGraphType] = useState("bar");
    const [dataSetType, setDataSetType] = useState("party");
  
    const handleSwitchChange = (event, type) => {
      if (event.target.checked) {
        setGraphType(type);
  
        if (type !== "bar" && dataSetType === "party") {
          setDataSetType("race");
        }
      }
=======
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
>>>>>>> origin/test-cody
    };
  
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8 flex justify-between ">
<<<<<<< HEAD
          <FormControl>
            <FormLabel
=======
          {/* <FormControl> */}
            {/* <FormLabel
>>>>>>> origin/test-cody
              id="demo-row-radio-buttons-group-label"
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Graph Filters:{" "}
<<<<<<< HEAD
            </FormLabel>
=======
            </FormLabel> */}
{/* 
>>>>>>> origin/test-cody
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
<<<<<<< HEAD
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
=======
  
              {dataSetType !== "party" && dataSetType !== "race" && dataSetType !== "income" && (
>>>>>>> origin/test-cody
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
<<<<<<< HEAD
          </FormControl>
=======
          </FormControl> */}
>>>>>>> origin/test-cody
  
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
<<<<<<< HEAD
                  setFilter("republican");
=======
                  // setFilter("republican");
>>>>>>> origin/test-cody
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
<<<<<<< HEAD
                setFilter("race");
=======
                // setFilter("race");
>>>>>>> origin/test-cody
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
<<<<<<< HEAD
                setFilter("income");
=======
                // setFilter("income");
>>>>>>> origin/test-cody
              }}
            >
              {" "}
              Income{" "}
            </button>
<<<<<<< HEAD
  
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
=======

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
        
>>>>>>> origin/test-cody
        </div>
      </div>
    );
  }