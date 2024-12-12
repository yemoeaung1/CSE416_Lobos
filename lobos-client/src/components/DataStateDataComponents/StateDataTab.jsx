import React, { useEffect, useState } from "react";
import axios from "axios";
import BarGraph from "../GraphPlotComponents/BarGraph";
import { Button, ButtonGroup, Box } from "@mui/material";
import { States, DataFilters, MapViewOptions, HeatMapFilters } from "../../enums";

export default function StateDataTab({ isLoading, heatmapOpts, setHeatmapOpts, selectedState, mapView, setMapView }) {
  const [stateInfo, setStateInfo] = useState(null);
  const [dataSetType, setDataSetType] = useState(DataFilters.PARTY)

  useEffect(() => {
    if (mapView != MapViewOptions.PRECINCT)
      setMapView(MapViewOptions.PRECINCT);
  }, []);

  useEffect(() => {
    if (selectedState !== States.NONE) {
      axios.get(`http://localhost:8080/api/state-info`, {
        params: {
          state: selectedState
        }
      })
        .then(response => {
          setStateInfo(response.data)
        })
        .catch(error => {
          console.error("Error Retrieving Info:", error);
        });
    }
  }, [selectedState]);

  return (
    <>
      <HeatMapSelection
        isLoading={isLoading}
        heatmapOpts={heatmapOpts}
        setHeatmapOpts={setHeatmapOpts}
      />
      <GraphContainer
        selectedState={selectedState}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
        stateInfo={stateInfo}
      />
    </>
  );
}

function HeatMapSelection({ isLoading, heatmapOpts, setHeatmapOpts }) {
  // Should be prevented if currently isLoading

  const heatmapButtons = [
    HeatMapFilters.NONE,
    HeatMapFilters.POVERTY_LEVEL,
    HeatMapFilters.REGION_TYPE,
    HeatMapFilters.ECONOMIC,
    HeatMapFilters.ECO_POLITICAL,
    HeatMapFilters.DEMOGRAPHIC,
  ]

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <ButtonGroup
          variant="contained"
          aria-label="linked button group"
          disabled={isLoading}
        >
          {heatmapButtons.map((element) => (
            <HeatMapButton
              key={element}
              isLoading={isLoading}
              heatmapOpts={heatmapOpts}
              setHeatmapOpts={setHeatmapOpts}
              buttonType={element}
            />
          ))}
        </ButtonGroup>
      </Box>
    </>
  );
}

function HeatMapButton({ heatmapOpts, setHeatmapOpts, buttonType }) {
  const isButtonSelected = (heatmapOpts && heatmapOpts.length > 0 && heatmapOpts[0] === buttonType);

  return (
    <Button
      onClick={() => setHeatmapOpts([buttonType])}
      sx={{
        backgroundColor: isButtonSelected ? "primary.main" : "grey.300",
        color: isButtonSelected ? "white" : "black",
        "&:hover": {
          backgroundColor: isButtonSelected ? "primary.dark" : "grey.400",
        },
      }}
    >
      {buttonType}
    </Button>
  );
}

function GraphContainer({ selectedState, dataSetType, setDataSetType, stateInfo }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <GraphButtonOptions dataSetType={dataSetType} setDataSetType={setDataSetType} />
        <GraphPopulationLabel stateInfo={stateInfo} />
      </div>
      <GraphDisplay selectedState={selectedState} dataSetType={dataSetType} />
    </div>
  )
}

function GraphButtonOptions({ dataSetType, setDataSetType }) {
  return (
    <>
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.PARTY} />
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.RACE} />
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.INCOME} />
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.REGION_TYPE} />
    </>
  );
}

function GraphButton({ dataSetType, setDataSetType, buttonType }) {
  let buttonClassName = (dataSetType === buttonType)
    ? "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
    : "text-xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"

  return (
    <button className={buttonClassName} onClick={() => { setDataSetType(buttonType) }}>
      {` ${buttonType} `}
    </button>
  );
}

function GraphPopulationLabel({ stateInfo }) {
  return (
    <>
      <div className="text-2xl font-bold text-center font-roboto ml-24 mt-2">
        <span>Total Population:</span>
        <span className="text-2xl font-normal"> {stateInfo ? stateInfo.stateData["Total Population"].toLocaleString() : "Loading..."} </span>
      </div>
    </>
  );
}

function GraphDisplay({ selectedState, dataSetType }) {
  return (
    <>
      <div className="h-3/4 w-full">
        <BarGraph dataSetType={dataSetType} selectedState={selectedState} />
      </div>
    </>
  );
}