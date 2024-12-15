import { Box, Button, ButtonGroup } from "@mui/material";
import BarGraph from "../GraphPlotComponents/BarGraph";
import { DataFilters } from "../../enums";

export default function GraphContainer({ selectedState, stateInfo, dataSetType, setDataSetType }) {
  return (
    <div className="flex flex-row">
      <GraphSelection
        stateInfo={stateInfo}
        dataSetType={dataSetType}
        setDataSetType={setDataSetType}
      />
      <BarGraph
        dataSetType={dataSetType}
        selectedState={selectedState}
      />
    </div>
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
    </div>
  )
}

function GraphButton({ dataSetType, setDataSetType, buttonType }) {
  const isButtonSelected = (dataSetType == buttonType);

  return (
    <Button
      onClick={() => setDataSetType([buttonType])}
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
