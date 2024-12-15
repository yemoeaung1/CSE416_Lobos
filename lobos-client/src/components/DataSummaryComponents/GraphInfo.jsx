import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataFilters, MapViewOptions, States } from "../../enums";

export default function GraphContainer({ selectedArea, mapView, dataSetType, setDataSetType }) {
  return (
    <>
      <GraphSelection
        mapView={mapView}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
      />
      <SelectionLabel 
        selectedArea={selectedArea}
        mapView={mapView}
      />
      <BarGraph
        mapView={mapView}
        dataSetType={dataSetType}
        selectedArea={selectedArea}
      />
    </>
  );
}

function GraphSelection({ mapView, dataSetType, setDataSetType }) {
  const graphOptions = [DataFilters.PARTY, DataFilters.RACE, DataFilters.INCOME, DataFilters.REGION_TYPE];

  if (mapView != MapViewOptions.STATE)
    graphOptions.pop();

  return (
    <div className="data-component-data-graph-selection">
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
    </div>
  );
}

function SelectionLabel({ selectedArea, mapView }){
  return (
    <div className="averia-serif text-lg p-2">
      {`Selected ${mapView}: ${selectedArea}`}
    </div>
  )
}

function BarGraph({ mapView, dataSetType, selectedArea }) {
  const chartRef = useRef(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (selectedArea != States.NONE) {
      axios.get(`http://localhost:8080/api/graph-bar`, {
        params: {
          area: selectedArea,
          view: mapView,
          filter: dataSetType
        }
      })
        .then(response => {
          const { labels, dataSets, title, xlabel, ylabel } = response.data;

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
            xTitle: xlabel,
            yTitle: ylabel,
          });
        })
        .catch(error => {
          console.error("Error Retrieving Info:", error);
        });
    }
  }, [dataSetType]);

  useEffect(() => {
    if (!graphData) return;

    const ctx = chartRef.current.getContext("2d");

    const BarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: graphData.labels,
        datasets: graphData.datasets,
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: graphData.xTitle,
              font: {
                size: 20,
              },
              color: "#000000",
            },
            ticks: {
              font: {
                size: 18,
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: graphData.yTitle,
              font: {
                size: 20,
              },
              color: "#000000",
            },
            ticks: {
              font: {
                size: 18,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: "Political Party",
            position: "top",
            labels: {
              font: {
                size: 16,
              },
            },
          },
          title: {
            display: true,
            text: graphData.title,
            font: {
              size: 28,
              weight: "bold",
            },
            color: "#000000",
          },
        },
      },
    });

    return () => {
      BarChart.destroy();
    };
  }, [graphData]);

  return (
    <div className="flex-1">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
};