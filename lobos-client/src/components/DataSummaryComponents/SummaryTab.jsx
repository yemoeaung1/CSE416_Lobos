import axios from 'axios';
import { useEffect, useState } from "react";
import { MapViewOptions, States } from '../../enums';

export default function SummaryTab({ isLoading, selectedState, mapView, setMapView, districtYear, setDistrictYear, setHighlightedDistrict }) {
  const [stateInfo, setStateInfo] = useState(null);

  useEffect(() => {
    if(mapView != MapViewOptions.DISTRICT)
      setMapView(MapViewOptions.DISTRICT);
  }, [])

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
  }, []);

  const isInfoUpdated = (stateInfo && stateInfo.state === selectedState)

  let stateDetails = isInfoUpdated
    ? {
      party: stateInfo.stateData["Political Party"],
      redistrictingParty: stateInfo.stateData["Redistricting Party"],
      population: stateInfo.stateData["Total Population"],
      income: stateInfo.stateData["Median Household Income"],
      poverty: stateInfo.stateData["Poverty Rate"],
    }
    : {
      party: "Loading...",
      redistrictingParty: "Loading...",
      population: "Loading...",
      income: "Loading...",
      poverty: "Loading...",
    }

  return (
    <>
      <div>
        <div>{`Congressional District Plan (${districtYear})`}</div>
        <div>{`Change to ${(districtYear == '2020') ? '2022' : '2020'}`}</div>
        <button 
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "gray" : "blue",
            color: "white",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onClick={() => { setDistrictYear((districtYear == '2020') ? '2022' : '2020') }}>
            Click Me
        </button>
      </div>
      <div className="flex flex-col items-center justify-center pb-8 montserrat">
        <span className="font-bold pb-2">Redistricting Party</span>
        <span>{stateDetails.redistrictingParty}</span>
      </div>
      <div className="data-component-info ">
        <div className={`data-component-info-stat-box montserrat`}>
          <span className="font-bold pb-2">Majority Party</span>
          <span>{`${stateDetails.party}`}</span>
        </div>
        <div className={`data-component-info-stat-box montserrat`}>
          <span className="font-bold pb-2">Population</span>
          <span>{`${stateDetails.population.toLocaleString()}`}</span>
        </div>
        <div className={`data-component-info-stat-box montserrat`}>
          <span className="font-bold pb-2">Median HH Income</span>
          <span>{`$${stateDetails.income.toLocaleString()}`}</span>
        </div>
        <div className={`data-component-info-stat-box montserrat`}>
          <span className="font-bold pb-2">Poverty Rate</span>
          <span>{`${stateDetails.poverty}%`}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {isInfoUpdated && <RepresentativesData stateInfo={stateInfo} selectedState={selectedState} setHighlightedDistrict={setHighlightedDistrict} />}
      </div>
    </>
  );
}

function RepresentativesData({ stateInfo, setHighlightedDistrict }) {
  const handleHover = (name, party) => {
    setHighlightedDistrict({ name: name, party: party })
  };

  const handleLeave = () => {
    setHighlightedDistrict({ name: "N/A", party: "N/A" });
  };

  const districts = Object.entries(stateInfo.districtData);

  return (
    <div className="table-container">
      <table className="montserrat congress-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Repr. Name</th>
            <th>Repr. Party</th>
            <th style={{ textAlign: 'right' }}>Median HH Income</th>
            <th style={{ textAlign: 'right' }}>Poverty Rate</th>
            <th style={{ textAlign: 'right' }}>Region (U)</th>
            <th style={{ textAlign: 'right' }}>Region (SU)</th>
            <th style={{ textAlign: 'right' }}>Region (R)</th>
            <th style={{ textAlign: 'right' }}>Vote Margin</th>
          </tr>
        </thead>
        <tbody>
          {districts.map(([districtName, details]) => (
            <tr
              key={districtName}
              className={details.Party === 'Democratic' ? 'hover:text-blue-600' : 'hover:text-red-600'}
              onMouseEnter={() => handleHover(districtName, details["Party"])}
              onMouseLeave={handleLeave}
            >
              <td>{details["Number"]}</td>
              <td>{details["Representative"]}</td>
              <td>{details["Party"]}</td>
              <td style={{ textAlign: 'right' }}>{`$${details["Median Household Income"].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
              <td style={{ textAlign: 'right' }}>{`${details["Poverty Rate"].toFixed(2)}%`}</td>
              <td style={{ textAlign: 'right' }}>{`${details["Region Type Distribution"]["Urban"].toFixed(2)}%`}</td>
              <td style={{ textAlign: 'right' }}>{`${details["Region Type Distribution"]["Suburban"].toFixed(2)}%`}</td>
              <td style={{ textAlign: 'right' }}>{`${details["Region Type Distribution"]["Rural"].toFixed(2)}%`}</td>
              <td style={{ textAlign: 'right' }}>{`${details["Vote Margin"].toFixed(2)}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};