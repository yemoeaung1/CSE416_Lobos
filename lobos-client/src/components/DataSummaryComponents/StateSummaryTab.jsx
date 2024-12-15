import axios from 'axios';
import { useEffect, useState } from "react";
import { MapViewOptions, States } from '../../enums';

export default function StateSummaryTab({ selectedState, mapView, setMapView }) {
    const [stateInfo, setStateInfo] = useState(null);

    useEffect(() => {
        if (mapView != MapViewOptions.STATE)
            setMapView(MapViewOptions.STATE);
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
        </>
    );
}
