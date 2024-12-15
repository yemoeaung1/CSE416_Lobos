import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import BarGraph from "../GraphPlotComponents/BarGraph";
import { Button, ButtonGroup, Box } from "@mui/material";
import { States, DataFilters, MapViewOptions, HeatMapFilters } from "../../enums";
import GraphContainer from "./DataTabGraphInfo";
import HeatMapInfo from "./DataTabHeatMapInfo";

export default function StateDataTab({ isLoading, heatmapOpts, setHeatmapOpts, selectedState, hoveredArea, mapView, setMapView }) {
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

    if (mapView == MapViewOptions.PRECINCT && heatmapOpts[0] == HeatMapFilters.DEMOGRAPHIC && heatmapOpts.length < 2)
      return;

    axios.get(`http://localhost:8080/api/state-map-legend`, {
      params: {
        heatmapOpts
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    })
      .then(response => {
        const infoData = response.data;
        infoData.type = heatmapOpts[0];

        setLegendInfo(infoData);
      })
      .catch(error => {
        console.error("Error Retrieving Info:", error);
      });
  }, [heatmapOpts]);

  return (
    <>
      <HeatMapInfo
        isLoading={isLoading}
        heatmapOpts={heatmapOpts}
        setHeatmapOpts={setHeatmapOpts}
        selectedState={selectedState}
        legendInfo={legendInfo}
        hoveredArea={hoveredArea}
      />
      <GraphContainer
        selectedState={selectedState}
        stateInfo={stateInfo}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
      />
    </>
  );
}