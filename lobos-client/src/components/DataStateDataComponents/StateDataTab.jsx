import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";

import BarGraph from "../GraphPlotComponents/BarGraph";
import { DataFilters } from "../../enums";

export default function StateDataTab({ setHeatmapOpts, selectedState }) {
  const [graphType, setGraphType] = useState("bar");
  const [heatMapEnabled, setHeatMapEnabled] = useState(false);
  const [dataSetType, setDataSetType] = useState(DataFilters.ECO_POLITICAL);
  const [selectedRace, setSelectedRace] = useState("All"); // Default race selection

  useEffect(() => {
    if(heatMapEnabled){
      console.log("HEATMAP TOGGLED");
      if(dataSetType === DataFilters.DEMOGRAPHIC)
        setHeatmapOpts([DataFilters.DEMOGRAPHIC, selectedRace]);
      else
        setHeatmapOpts(dataSetType);
    }
  }, [heatMapEnabled]);

  //Enables the Heat Map
  const handleHeatMapChange = (event) => {
    setHeatMapEnabled(!heatMapEnabled);
  };

  // Handles Race Selection Change
  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
    console.log("Selected Race:", event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex justify-between ">
        {/*Buttons on the top right corner*/}
        <div className="mt-5">
          {graphType === "bar" && (
            <button
              className={
                dataSetType === DataFilters.ECO_POLITICAL
                  ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType(DataFilters.ECO_POLITICAL);
                // setFilter("republican");
              }}
            >
              Party{" "}
            </button>
          )}

          <button
            className={
              dataSetType === DataFilters.DEMOGRAPHIC
                ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType(DataFilters.DEMOGRAPHIC);
              // setFilter("race");
            }}
          >
            Race{" "}
          </button>

          <button
            className={
              dataSetType === DataFilters.ECONOMIC
                ? "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType(DataFilters.ECONOMIC);
              // setFilter("income");
            }}
          >
            {" "}
            Income{" "}
          </button>

          <button
            className={
              dataSetType === DataFilters.REGION_TYPE
                ? "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType(DataFilters.REGION_TYPE);
              // setFilter("region");
            }}
          >
            {" "}
            Region Type{" "}
          </button>
        </div>

        <div className="text-3xl font-bold text-center font-roboto mr-8">
          Total Population:
          <span className="text-2xl font-normal"> 1720817</span>
        </div>
      </div>

      <div className="h-3/4 w-full">
        {graphType === "bar" && (
          <BarGraph dataSetType={dataSetType} selectedState={selectedState} />
        )}
        {/* {graphType === "box" && <BoxPlotGraph dataSetType={dataSetType} />}
          {graphType === "line" && <LineGraph dataSetType={dataSetType} />} */}

        {/* Checkbox for HeatMap */}
        <div className="items-center flex flex-col mt-8 ">
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
            label={
              <span className="text-2xl font-semibold">Enable Heatmap</span>
            }
          />
        </div>

        <div className="mt-8">
          {/* Race Selection (Radio Group) */}
          {dataSetType === DataFilters.DEMOGRAPHIC && (
            <div className="flex flex-col items-center">
              <RadioGroup
                row
                aria-labelledby="select-race-label"
                name="race-radio-buttons"
                value={selectedRace}
                onChange={handleRaceChange}
                className="justify-center mt-4"
              >
                <FormControlLabel
                  value="White"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem"}}>
                      White
                    </span>
                  }
                />
                <FormControlLabel
                  value="Black"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem" }}>
                      Black
                    </span>
                  }
                />
                <FormControlLabel
                  value="Asian"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem" }}>
                      Asian
                    </span>
                  }
                />
                <FormControlLabel
                  value="Hispanic"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem" }}>
                      Hispanic
                    </span>
                  }
                />
                <FormControlLabel
                  value="Native American"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem"}}>
                      Native American
                    </span>
                  }
                />
                <FormControlLabel
                  value="Pacific Islanders"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem" }}>
                      Pacific Islanders
                    </span>
                  }
                />
                <FormControlLabel
                  value="Other Race"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.3rem" }}>
                      Other Race
                    </span>
                  }
                />
              </RadioGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
