import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import BarGraph from "../GraphPlotComponents/BarGraph";
import { Button, ButtonGroup, Box, Menu, MenuItem } from "@mui/material";
import { States, DataFilters, MapViewOptions, HeatMapFilters } from "../../enums";

export default function StateDataTab({ isLoading, heatmapOpts, setHeatmapOpts, selectedState, mapView, setMapView }) {
  const [stateInfo, setStateInfo] = useState(null);
  const [dataSetType, setDataSetType] = useState(DataFilters.PARTY)
  const [legendInfo, setLegendInfo] = useState(null);

  useEffect(() => {
    if (mapView != MapViewOptions.PRECINCT)
      setMapView(MapViewOptions.PRECINCT);

    return () => {
      setHeatmapOpts([HeatMapFilters.NONE]);
    };
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

  useEffect(() => {
    if (heatmapOpts[0] == HeatMapFilters.NONE) {
      setLegendInfo(null);
      return;
    }

    axios.get(`http://localhost:8080/api/state-map-legend`, {
      params: {
        heatmapOpts
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    })
      .then(response => {
        setLegendInfo(response.data)
      })
      .catch(error => {
        console.error("Error Retrieving Info:", error);
      });
  }, [heatmapOpts]);

  return (
    <>
      <SelectionMenu
        isLoading={isLoading}
        heatmapOpts={heatmapOpts}
        setHeatmapOpts={setHeatmapOpts}
        selectedState={selectedState}
        stateInfo={stateInfo}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
        legendInfo={legendInfo}
      />
      <BarGraph
        dataSetType={dataSetType}
        selectedState={selectedState}
      />
    </>
  );
}

function SelectionMenu({ isLoading, heatmapOpts, setHeatmapOpts, legendInfo, selectedState, stateInfo, dataSetType, setDataSetType }) {
  return (
    <div className="flex flex-row">
      <HeatMapLegend legendInfo={legendInfo} />
      <HeatMapSelection
        isLoading={isLoading}
        heatmapOpts={heatmapOpts}
        setHeatmapOpts={setHeatmapOpts}
      />
      <GraphSelection
        stateInfo={stateInfo}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
      />
    </div>
  );
}

function HeatMapLegend({ legendInfo }) {
  return (
    <div className="data-component-data-heatmap-legend">
      <h1>Legend</h1>
      {legendInfo == null &&
        <>
          LEGEND NULL
        </>
      }

      {legendInfo != null &&
        <>
          {Object.entries(legendInfo).map(([key, { name, color, opacity }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Color Square */}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  opacity: opacity,
                  border: '1px solid #000',
                }}
              ></div>
              {/* Label */}
              <span>{name}</span>
            </div>
          ))}
        </>
      }
    </div>
  );
}

function HeatMapSelection({ isLoading, heatmapOpts, setHeatmapOpts }) {
  const heatmapButtons = [
    HeatMapFilters.NONE,
    HeatMapFilters.POVERTY_LEVEL,
    HeatMapFilters.REGION_TYPE,
    HeatMapFilters.ECONOMIC,
    HeatMapFilters.ECO_POLITICAL,
    HeatMapFilters.DEMOGRAPHIC
  ]

  return (
    <div className="data-component-data-heatmap-selection">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <ButtonGroup
          variant="contained"
          aria-label="linked button group"
          orientation="vertical"
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
    </div>
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


function GraphSelection({ stateInfo, dataSetType, setDataSetType }) {
  const graphOptions = [DataFilters.PARTY, DataFilters.RACE, DataFilters.INCOME, DataFilters.REGION_TYPE];

  return (
    <div className="data-component-data-graph-selection">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <ButtonGroup
          variant="contained"
          aria-label="linked button group"
          orientation="vertical"
        >
          {graphOptions.map((element) => (
            <GraphButton
              key={element}
              dataSetType={dataSetType}
              setDataSetType={setDataSetType}
              buttonType={element}
            />
          ))}
        </ButtonGroup>
      </Box>
      <GraphPopulationLabel
        stateInfo={stateInfo}
      />
    </div>
  )
}

function GraphButton({ dataSetType, setDataSetType, buttonType }) {
  const isButtonSelected = (dataSetType == buttonType);

  return (
    <Button
      onClick={() => setDataSetType([buttonType])}
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