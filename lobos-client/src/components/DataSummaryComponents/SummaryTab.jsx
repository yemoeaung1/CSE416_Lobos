import axios from 'axios';
import { useEffect, useState } from "react";
import { MapViewOptions, States } from '../../enums';

export default function SummaryTab({ selectedState, setMapView }) {
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

  let party = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Political Party"] : "N/A";
  let population = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Total Population"] : "N/A";
  let income = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Median Household Income"] : "N/A";
  let race = (stateInfo && stateInfo.state === selectedState) ? stateInfo.data["Majority Race"] : "N/A";

  return (
    <>
      <div className="data-component-info-top p-4">
        <div className="data-component-info-top-left">
          <div className="data-component-info-stat-box">
            <span className="font-bold underline merriweather pb-2">Population</span>
            <span className="montserrat">{`${population.toLocaleString()}`}</span>
          </div>
          <div className="data-component-info-stat-box">
            <span className="font-bold underline merriweather">Median</span>
            <span className="font-bold underline merriweather pb-2">Household Income</span>
            <span className="montserrat">{`${income.toLocaleString()}`}</span>
          </div>
        </div>
        <div className="data-component-info-top-right">
          <div className="data-component-info-stat-box">
            <span className="font-bold underline merriweather pb-2">Majority Race</span>
            <span className="montserrat">{`${race}`}</span>
          </div>
          <div className="data-component-info-stat-box">
            <span className="font-bold underline merriweather pb-2">Majority Party</span>
            <span className="montserrat">{`${party}`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
          <RepresentativesData stateInfo={stateInfo} selectedState={selectedState} />
      </div>
    </>
  );
}

function RepresentativesData({ stateInfo, selectedState }) {
  let districts = (stateInfo && stateInfo.state === selectedState) ? stateInfo.table.data : null;

  if (districts === null) {
    return <></>;
  } else {
    districts = Object.entries(districts);
    return (
      <div className="table-container">
        <table className="merriweather congress-table">
          <thead>
            <tr>
              <th className="text-lg">Congressional District</th>
              <th className="text-lg">Representative</th>
              <th className="text-lg">Party</th>
            </tr>
          </thead>
          <tbody>
            {districts.map(([districtName, details]) => (
              <tr key={districtName} className={details.Party === 'Democratic' ? 'hover:text-blue-500' : 'hover:text-red-500'}>
                <td className="text-sm">{districtName}</td>
                <td className="text-sm">{details.Representative}</td>
                <td className="text-sm">{details.Party}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    );
  }
};