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
import axios from "axios";

function formatNumberWithCommas(number) {
  return number.toLocaleString();
}

export default function StateDataTab({ selectedState }) {
  const [graphType, setGraphType] = useState("bar");
  const [dataSetType, setDataSetType] = useState("race");
  const [heatMapEnabled, setHeatMapEnabled] = useState(false);
  const [selectedRace, setSelectedRace] = useState("All");
  const [stateInfo, setStateInfo] = useState(null);
  
  useEffect(() => {
      axios.get(`http://localhost:8080/api/state-info`, {
        params: {
          state: selectedState
        }
      })
        .then(response => {
          console.log(response.data)
          setStateInfo(response.data)
        })
        .catch(error => {
          console.error("Error Retrieving Info:", error);
        });
    }
  , [selectedState]);

  //Enables the Heat Map
  const handleHeatMapChange = (event) => {
    setHeatMapEnabled(event.target.checked);
    console.log("HeatMap Enabled:", event.target.checked);
  };

  // Handles Race Selection Change
  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
    console.log("Selected Race:", event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between">
        {/*Buttons on the top right corner*/}
        <div className="flex ">
          {graphType === "bar" && (
            <button
              className={
                dataSetType === "party"
                  ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
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
                ? "text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
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
                ? "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
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
                ? "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
            }
            onClick={() => {
              setDataSetType("region");
              // setFilter("region");
            }}
          >
            {" "}
            Region Type{" "}
          </button>

        <div className="text-2xl font-bold text-center font-roboto ml-24 mt-2">
          Total Population:
          <span className="text-2xl font-normal"> {stateInfo ? formatNumberWithCommas(stateInfo.data["Total Population"]) : "Loading..."} </span>
        </div>
        </div>

      </div>

      <div className="h-3/4 w-full">
        {graphType === "bar" && (
          <BarGraph dataSetType={dataSetType} selectedState={selectedState} />
        )}

        {/* Checkbox for HeatMap */}
        <div className="items-center flex flex-col ">
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

        <div className="">
          {/* Race Selection (Radio Group) */}
          {dataSetType === "race" && (
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem"}}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem" }}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem" }}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem" }}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem"}}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem" }}>
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
                          fontSize: 20,
                        },
                      }}
                      disabled={!heatMapEnabled}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.0rem" }}>
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
