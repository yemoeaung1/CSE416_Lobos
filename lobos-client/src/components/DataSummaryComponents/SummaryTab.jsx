import axios from 'axios';
import { useEffect, useState } from "react";
import { MapViewOptions, States } from '../../enums';

export default function SummaryTab({ selectedState, setMapView, setHighlightedDistrict }) {
  const [stateInfo, setStateInfo] = useState(null);

  useEffect(() => {
    setMapView(MapViewOptions.DISTRICT);
  }, [])

  useEffect(() => {
    if(selectedState !== States.NONE){
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
  }, [selectedState]);

  let party = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Political Party"] : "Loading";
  let redistrictingParty = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Redistricting Party"] : "Loading";
  let population = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Total Population"] : "Loading";
  let income = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Median Household Income"] : "Loading";
  let poverty = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Poverty Rate"] : "Loading";

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-8">
        <span className="font-bold underline merriweather pb-2">Redistricting Party</span>
        <span className="montserrat">{redistrictingParty}</span>
      </div>
      <div className="data-component-info ">
        <div className={`data-component-info-stat-box ${party === "Republican" ? "red" : ""} ${party === "Democrat" ? "blue" : ""}`}>
          <span className="font-bold underline merriweather pb-2">Majority Party</span>
          <span className="montserrat">{`${party}`}</span>
        </div>
        <div className={`data-component-info-stat-box ${party === "Republican" ? "red" : ""} ${party === "Democrat" ? "blue" : ""}`}>
          <span className="font-bold underline merriweather pb-2">Population</span>
          <span className="montserrat">{`${population.toLocaleString()}`}</span>
        </div>
        <div className={`data-component-info-stat-box ${party === "Republican" ? "red" : ""} ${party === "Democrat" ? "blue" : ""}`}>
          <span className="font-bold underline merriweather pb-2">Median HH Income</span>
          <span className="montserrat">{`$${income.toLocaleString()}`}</span>
        </div>
        <div className={`data-component-info-stat-box ${party === "Republican" ? "red" : ""} ${party === "Democrat" ? "blue" : ""}`}>
          <span className="font-bold underline merriweather pb-2">Poverty Rate</span>
          <span className="montserrat">{`${poverty}%`}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
          <RepresentativesData stateInfo={stateInfo} selectedState={selectedState} setHighlightedDistrict={setHighlightedDistrict} />
      </div>
    </>
  );
}

function RepresentativesData({ stateInfo, selectedState, setHighlightedDistrict }) {
  let districts = (stateInfo && stateInfo.state === selectedState) ? stateInfo.table.data : null;

  const handleHover = (name) => {
    setHighlightedDistrict(name)
  }; 

  const handleLeave = (rowData) => {
    setHighlightedDistrict("");
  };


  if (districts === null) {
    return <></>;
  } else {
    districts = Object.entries(districts);

    return (
      <div className="table-container">
        <table className="merriweather congress-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Repr. Name</th>
              <th>Repr. Party</th>
              <th>Repr. Race</th>
              <th>Median HH Income</th>
              <th>Poverty Rate</th>
              <th>Region (U)</th>
              <th>Region (SU)</th>
              <th>Region (R)</th>
              <th>Vote Margin</th>
            </tr>
          </thead>
          <tbody>
            {districts.map(([districtName, details]) => (
              <tr 
                key={districtName} 
                className={details.Party === 'Democratic' ? 'hover:text-blue-600' : 'hover:text-red-600'}
                onMouseEnter={() => handleHover(districtName)}
                onMouseLeave={handleLeave}
              >
                  <td>{details["Number"]}</td>
                  <td>{details["Representative"]}</td>
                  <td>{details["Party"]}</td>
                  <td>{details["Representative Race"]}</td>
                  <td>{`$${details["Median Household Income"].toLocaleString()}`}</td>
                  <td>{`${details["Poverty Rate"]}%`}</td>
                  <td>{`${details["Region Type Distribution"]["Urban"]}%`}</td>
                  <td>{`${details["Region Type Distribution"]["Suburban"]}%`}</td>
                  <td>{`${details["Region Type Distribution"]["Rural"]}%`}</td>
                  <td>{`${details["Vote Margin"]}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    );
  }
};