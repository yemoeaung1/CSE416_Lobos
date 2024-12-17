import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataFilters, MapViewOptions, States } from "../../enums";
import BarGraph from "../GraphPlotComponents/BarGraph";

export default function GraphContainer({ selectedArea, selectedState, mapView, dataSetType, setDataSetType }) {
  const [graphData, setGraphData] = useState(null);
  const [populationData, setPopulationData] = useState(0);

  useEffect(() => {
    if (selectedArea != States.NONE) {
      axios.get(`http://localhost:8080/api/graph-bar`, {
        params: {
          state: selectedState,
          area: selectedArea,
          view: mapView,
          filter: dataSetType
        }
      })
        .then(response => {
          const { labels, dataSets, title, ylabel } = response.data.data;

          setPopulationData(response.data.population);
          setGraphData({
            labels,
            datasets: dataSets.map((dataSet) => ({
              label: dataSet.label,
              data: dataSet.data,
              backgroundColor: dataSet.backgroundColor,
              borderColor: dataSet.borderColor,
              borderWidth: dataSet.borderWidth,
            })),
            title: title,
            yTitle: ylabel,
          });
        })
        .catch(error => {
          console.error("Error Retrieving Info:", error);
        });
    }
  }, [dataSetType, selectedArea]);

  return (
    <div className="data-component-graph-container">
      <GraphSelection
        mapView={mapView}
        selectedArea={selectedArea}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
        populationData={populationData}
      />
      <BarGraph
        graphData={graphData}
      />
    </div>
  );
}

function GraphSelection({ mapView, selectedArea, dataSetType, setDataSetType, populationData }) {
  const graphOptions = [DataFilters.PARTY, DataFilters.RACE, DataFilters.MINORITY, DataFilters.INCOME, DataFilters.REGION_TYPE];

  if (mapView === MapViewOptions.PRECINCT)
    graphOptions.pop();

  return (
    <div className="data-component-graph-selection">
      <FormControl>
        <InputLabel id="graph-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>Graph Options</InputLabel>
        <Select
          labelId="graph-dropdown-label"
          value={dataSetType}
          onChange={(event) => setDataSetType(event.target.value)}
          label="Graph Options"
          sx={{
            minWidth: '196px',
            fontFamily: "Montserrat, san-serif",
          }}
        >
          {graphOptions.map((option, index) => (
            <MenuItem key={index} value={option} sx={{ fontFamily: "Montserrat, san-serif" }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="averia-serif text-lg pt-2 pb-1 pl-1 font-bold">{`Selected ${mapView}:`}</div>
      <div className="averia-serif text-base pl-1">{`${selectedArea}`}</div>
      <div className="averia-serif text-lg pt-8 pb-1 font-bold pl-1">{`Total Population:`}</div>
      <div className="averia-serif text-base pl-1">{`${populationData.toLocaleString()}`}</div>
    </div>
  );
}