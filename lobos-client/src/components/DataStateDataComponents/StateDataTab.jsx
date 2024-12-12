import React, { useEffect, useState } from "react";
import BarGraph from "../GraphPlotComponents/BarGraph";
import axios from "axios";
import { States, DataFilters, MapViewOptions } from "../../enums";

export default function StateDataTab({ heatmapOpts, setHeatmapOpts, selectedState, mapView, setMapView }) {
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
      <HeatMapSelection />
      <GraphContainer
        selectedState={selectedState}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
        stateInfo={stateInfo}
      />
    </>
  );
}

function HeatMapSelection() {
  return (
    <></>
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
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.PARTY}/>
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.RACE}/>
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.INCOME}/>
      <GraphButton dataSetType={dataSetType} setDataSetType={setDataSetType} buttonType={DataFilters.REGION_TYPE}/>
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