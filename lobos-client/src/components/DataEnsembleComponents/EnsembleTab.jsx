import axios from 'axios';
import { useState, useEffect } from 'react';
import BoxPlotGraph from './EnsembleBoxPlot';
import { MapViewOptions, States } from '../../enums';
import SplitsBarGraph from './SplitsBarGraph';
import { FormControl, InputLabel, MenuItem, Select, ButtonGroup, Button } from '@mui/material';
import { fieldNamesToDisplay, groupedCategories } from './Constants';
import DistrictWinCountGraph from './DistrictWinCountGraph';
import EnsembleComparisonTab from './EnsembleComparisonTab';

export default function EnsembleTab({ selectedState, mapView, setMapView }) {
  const [selectedTab, setSelectedTab] = useState('Summary');

  useEffect(() => {
    if (mapView != MapViewOptions.DISTRICT)
      setMapView(MapViewOptions.DISTRICT);
  }, [])

  return (
    <div className='data-component-container'>
      <div className="flex flex-col h-full">
        <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {selectedTab === 'Summary' && <EnsembleSummary selectedState={selectedState} />}
        {selectedTab === 'Compare Plans' && <EnsembleComparisonTab selectedState={selectedState} />}
        {selectedTab === 'Graph' && <EnsembleBoxAndWhiskers selectedState={selectedState} />}
      </div>
    </div>
  );
}

function TabSelector({ selectedTab, setSelectedTab }) {

  const tabStyle = {
    cursor: "pointer",
    paddingBottom: "4px",
    marginRight: "8px",
    fontSize: "16px",
    transition: "color 0.3s ease",
    color: "#6b7280",
    borderBottom: "2px solid transparent",
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#2563eb",
    borderBottom: "4px solid #2563eb",
  };

  return (
    <nav
      className="flex justify-end mb-4 space-x-8 border-b-2 border-gray-300"
      style={{ borderBottom: "2px solid #e5e7eb" }}
    >
      <div
        style={
          selectedTab == 'Summary'
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab('Summary')}
      >
        Summary
      </div>
      <div
        style={
          selectedTab == 'Graph'
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab('Graph')}
      >
        Box Plot Analysis
      </div>
      <div
        style={
          selectedTab == 'Compare Plans'
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab('Compare Plans')}
      >
        Compare Plans
      </div>
    </nav>
  )
}

function EnsembleTable({ selectedState }) {

  return (
    <div>
      <p className='w-full text-center montserrat font-bold pb-1'>Available Ensembles for {selectedState}</p>
      <div className="table-container">
        <table className="montserrat congress-table">
          <thead>
            <tr>
              <th style={{ width: '32px' }}>#</th>
              <th>Number of District Plans</th>
              <th>Population Equality Threshold Used</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>5000</td>
              <td>0.06</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


function EnsembleSummary({ selectedState }) {
  const [splitsGraphData, setSplitsGraphData] = useState(null);

  useEffect(() => {
    if (selectedState === States.NONE)
      return;

    axios.get(`http://localhost:8080/api/ensemble/splits`, {
      params: {
        state: selectedState
      }
    })
      .then(response => {
        setSplitsGraphData(response.data);
      })
      .catch(error => {
        console.error("Error Fetching Splits Data:", error);
      });
  }, [selectedState]);

  return (
    <>
      <EnsembleTable selectedState={selectedState} />
      <SplitsBarGraph graphData={splitsGraphData} />
    </>
  )
}

function EnsembleBoxAndWhiskers({ selectedState }) {
  const [selectedGroup, setSelectedGroup] = useState(Object.keys(groupedCategories)[0]); // Default to the first group
  const [selectedCategory, setSelectedCategory] = useState(groupedCategories[selectedGroup][0]); // Default to the first category in the selected group
  return (
    <>
      <div className='w-full flex flex-row h-16'>
        <div className="flex w-2/3 p-2 flex-row gap-4">
          <ButtonGroup
            variant="contained"
            aria-label="linked button group"
            orientation="horizontal"
          >
            {Object.keys(groupedCategories).map((group, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedCategory(groupedCategories[group][0]); // Update default category for the new group
                }}
                sx={{
                  textTransform: 'none',
                  padding: "4px 12px",
                  minHeight: "32px",
                  fontSize: "1.0rem",
                  fontFamily: "Montserrat, san-serif",
                  backgroundColor: (selectedGroup === group) ? "primary.main" : "grey.200",
                  color: (selectedGroup === group) ? "grey.200" : "primary.main",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: (selectedGroup === group) ? "primary.dark" : "grey.300",
                  },
                }}
              >
                {fieldNamesToDisplay[group]}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="p-2 w-1/3">
          <CategoryDropdown categories={groupedCategories[selectedGroup]} setSelectedCategory={setSelectedCategory} selectedGroup={selectedGroup} selectedCategory={selectedCategory} />
        </div>
      </div>
      <BoxPlotGraph selectedState={selectedState} dataSetType={selectedCategory} dataCategory={selectedGroup} displayName={fieldNamesToDisplay[selectedCategory]} />
    </>
  )
}

function CategoryDropdown({ categories, setSelectedCategory, selectedGroup, selectedCategory }) {
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="ensemble-dropdown-label">{selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)}</InputLabel>
        <Select
          labelId="ensemble-dropdown-label"
          value={selectedCategory}
          label={selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)}
          onChange={(event) => setSelectedCategory(event.target.value)}
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            height: '48px',
          }}
        >
          {categories.map((category) => (
            <MenuItem value={category}>{fieldNamesToDisplay[category]}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
