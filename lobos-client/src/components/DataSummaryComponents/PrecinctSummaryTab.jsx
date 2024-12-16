import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { States, DataFilters, MapViewOptions, HeatMapFilters } from "../../enums";
import GraphContainer from "./GraphInfo";
import HeatMapInfo from "./HeatMapInfo";

export default function PrecinctSummaryTab({ isLoading, heatmapOpts, setHeatmapOpts, selectedState, selectedArea, setSelectedArea, hoveredArea, mapView, setMapView }) {
  const [initLoad, setInitLoad] = useState(false);
  const [dataSetType, setDataSetType] = useState(DataFilters.PARTY);
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
      axios.get(`http://localhost:8080/api/precinct-entry`, {
        params: {
          state: selectedState
        }
      })
        .then(response => {
          setSelectedArea(response.data.name);
          setInitLoad(true);
        })
        .catch(error => {
          console.error("Error Retrieving Info:", error);
          setInitLoad(true);
        });
    }
  }, []);

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
        legendInfo={legendInfo}
        hoveredArea={hoveredArea}
      />
      {initLoad &&
        <GraphContainer
          selectedArea={selectedArea}
          selectedState={selectedState}
          mapView={MapViewOptions.DISTRICT}
          dataSetType={dataSetType}
          setDataSetType={setDataSetType}
        />
      }
    </>
  );
}