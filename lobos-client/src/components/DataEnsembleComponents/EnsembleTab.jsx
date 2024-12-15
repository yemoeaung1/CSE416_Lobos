import { useState } from 'react';
import BoxPlotGraph from './EnsembleBoxPlot';

export default function EnsembleTab({ selectedState }) {
  const groupedCategories = {
    Demographics: ['non_hispanic', 'hispanic', 'white', 'black', 'asian'],
    Income: ['LESS_10K', '10K_15K', '15K_20K', '20K_25K', '25K_30K', '30K_35K', '35K_40K', '40K_45K', '45K_50K', '50K_60K', '60K_75K', '75K_100K', '100K_125K', '125K_150K', '150K_200K', '200K_MORE'],
    Geography: ['poverty_rate', 'POPULATION_RURAL', 'POPULATION_URBAN', 'POPULATION_SUBURBAN'],
    Voting: ['2020_PRES_R', '2020_PRES_D']
  };

  const [selectedGroup, setSelectedGroup] = useState(Object.keys(groupedCategories)[0]); // Default to the first group
  const [selectedCategory, setSelectedCategory] = useState(groupedCategories[selectedGroup][0]); // Default to the first category in the selected group

  console.log(selectedCategory);
  console.log(selectedGroup);

  return (
    <div className="flex flex-col h-full">
      {/* Group Selector */}
      <div className="flex justify-around p-2">
        {Object.keys(groupedCategories).map((group, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedCategory(groupedCategories[group][0]); // Update default category for the new group
            }}
            className={`p-2 border rounded border-black border-2 ${
              selectedGroup === group ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Dropdown for Selected Group */}
      <div className="p-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {groupedCategories[selectedGroup].map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Display Graph */}
      <BoxPlotGraph selectedState={selectedState} dataSetType={selectedCategory} />
    </div>
  );
}