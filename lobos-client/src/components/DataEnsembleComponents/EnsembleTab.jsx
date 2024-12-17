import { useState, useEffect } from 'react';
import BoxPlotGraph from './EnsembleBoxPlot';
import { MapViewOptions } from '../../enums';
import SplitsBarGraph from './EnsembleBarGraph';
import WinnerTallyChart from './DistrictWinnerTallyChart';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { fieldNamesToDisplay, groupedCategories } from './Constants';
import DistrictWinCountGraph from './DistrictWinnerTallyChart';

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
        {selectedTab == 'Summary' && <EnsembleSummary selectedState={selectedState} />}
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
        Box & Whiskers
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
  const [alignment, setAligment] = useState("splits")

  const handleTabChange = (e, newAlignment) => {
    if(newAlignment !== null) setAligment(newAlignment);
  }
  return (
    <>
      <EnsembleTable selectedState={selectedState} />
      <EnsembleSummaryGraphToggle alignment={alignment} handleChange={handleTabChange} />
      {alignment === "splits" && <SplitsBarGraph selectedState={selectedState} />}
      {alignment === "winnerTallyCount" && <DistrictWinCountGraph selectedState={selectedState} />}
    </>
  )
}

function EnsembleSummaryGraphToggle({ alignment, handleChange }) {
  return (
    <div className="flex ">
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive={true}
      onChange={handleChange}
      aria-label="Platform"
      size="medium"
    >
      <ToggleButton value="splits">Splits</ToggleButton>
      <ToggleButton value="winnerTallyCount">District Winners</ToggleButton>
    </ToggleButtonGroup>
    </div>
  )
}

function EnsembleBoxAndWhiskers({ selectedState }) {
  const [selectedGroup, setSelectedGroup] = useState(Object.keys(groupedCategories)[0]); // Default to the first group
  const [selectedCategory, setSelectedCategory] = useState(groupedCategories[selectedGroup][0]); // Default to the first category in the selected group
  return (
    <>
      <div>Select Filter</div>
      <div className="flex justify-around p-2">
        {Object.keys(groupedCategories).map((group, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedCategory(groupedCategories[group][0]); // Update default category for the new group
            }}
            className={`text-xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl ${selectedGroup === group ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
          >
            {fieldNamesToDisplay[group]}
          </button>
        ))}
      </div>

      <div className="p-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-1/4 p-2 border border-gray-300 rounded"
        >
          {groupedCategories[selectedGroup].map((category, index) => (
            <option key={index} value={category}>
              {fieldNamesToDisplay[category]}
            </option>
          ))}
        </select>
      </div>
      <BoxPlotGraph selectedState={selectedState} dataSetType={selectedCategory} dataCategory={selectedGroup} displayName={fieldNamesToDisplay[selectedCategory]} />
    </>
  )
}
