import { useState, useEffect } from 'react';
import BoxPlotGraph from './EnsembleBoxPlot';
import { MapViewOptions } from '../../enums';
import SplitsBarGraph from './EnsembleBarGraph';

export default function EnsembleTab({ selectedState, mapView, setMapView }) {
  const [selectedTab, setSelectedTab] = useState('table');

  useEffect(() => {
    if (mapView != MapViewOptions.DISTRICT)
      setMapView(MapViewOptions.DISTRICT);
  }, [])

  // Define a mapping for display names
  const fieldNamesToDisplay = {
    'non_hispanic': 'Non-Hispanic',
    'hispanic': 'Hispanic',
    'white': 'White',
    'black': 'Black',
    'asian': 'Asian',
    'LESS_10K': '< $10K',
    "10K_15K": '$10K - $15K',
    "15K_20K": '$15K - $20K',
    "20K_25K": '$20K - $25K',
    "25K_30K": '$25K - $30K',
    "30K_35K": '$30K - $35K',
    "35K_40K": '$35K - $40K',
    "40K_45K": '$40K - $45K',
    "45K_50K": '$45K - $50K',
    "50K_60K": '$50K - $60K',
    "60K_75K": '$60K - $75K',
    "75K_100K": '$75K - $100K',
    "100K_125K": '$100K - $125K',
    "125K_150K": '$125K - $150K',
    "150K_200K": '$150K - $200K',
    "200K_MORE": '> $200K',
    "2020_PRES_R": 'Republican Votes (2020)',
    "2020_PRES_D": 'Democratic Votes (2020)',
    'POPULATION_RURAL': 'Rural Population',
    'POPULATION_URBAN': 'Urban Population',
    'POPULATION_SUBURBAN': 'Suburban Population',
    'Demographics': 'Demographics',
    'Income': 'Income Levels',
    'Region_Type': 'Region Type',
    'Voting': 'Voting',
  }

  const groupedCategories = {
    Demographics: ['non_hispanic', 'hispanic', 'white', 'black', 'asian'],
    Income: ['LESS_10K', '10K_15K', '15K_20K', '20K_25K', '25K_30K', '30K_35K', '35K_40K', '40K_45K', '45K_50K', '50K_60K', '60K_75K', '75K_100K', '100K_125K', '125K_150K', '150K_200K', '200K_MORE'],
    Region_Type: ['POPULATION_RURAL', 'POPULATION_URBAN', 'POPULATION_SUBURBAN'],
    Voting: ['2020_PRES_R', '2020_PRES_D']
  };

  const [selectedGroup, setSelectedGroup] = useState(Object.keys(groupedCategories)[0]); // Default to the first group
  const [selectedCategory, setSelectedCategory] = useState(groupedCategories[selectedGroup][0]); // Default to the first category in the selected group


  return (
    <div className="flex flex-col h-full">
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {/* Group Selector */}
      {/* Dropdown for Selected Group */}
      {selectedTab == 'table' &&
      <>
              <EnsembleTable selectedState={selectedState}/>
              <SplitsBarGraph selectedState={selectedState}/>
              </>
}
      {selectedTab === 'chart' && (
        <>
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
          <BoxPlotGraph selectedState={selectedState} dataSetType={selectedCategory} dataCategory={selectedGroup} displayName={fieldNamesToDisplay[selectedCategory]}/>
        </>
      )}
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
          selectedTab == 'table'
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab('table')}
      >
        Table
      </div>
      <div
        style={
          selectedTab == 'chart'
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab('chart')}
      >
        Chart
      </div>
    </nav>
  )
}

function EnsembleTable({selectedState}) {

  return (
    <>
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
      </>
  );
};