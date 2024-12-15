import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Box, Button, ButtonGroup } from "@mui/material";
import { DataFilters, States } from "../../enums";

export default function GraphContainer({ selectedArea, mapView, dataSetType, setDataSetType }) {
  return (
    <div className="flex flex-row">
      <GraphSelection
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
      />
      <BarGraph
        mapView={mapView}
        dataSetType={dataSetType}
        selectedArea={selectedArea}
      />
    </div>
  );
}

function GraphSelection({ dataSetType, setDataSetType }) {
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
    </div>
  )
}

function GraphButton({ dataSetType, setDataSetType, buttonType }) {
  const isButtonSelected = (dataSetType == buttonType);

  return (
    <Button
      onClick={() => setDataSetType(buttonType)}
      sx={{
        textTransform: 'none',
        backgroundColor: isButtonSelected ? "primary.main" : "grey.200",
        color: isButtonSelected ? "grey.200" : "primary.main",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: isButtonSelected ? "primary.dark" : "grey.300",
        },
      }}
    >
      {buttonType}
    </Button>
  );
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
    <div className="flex-1 flex justify-center items-center">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
};