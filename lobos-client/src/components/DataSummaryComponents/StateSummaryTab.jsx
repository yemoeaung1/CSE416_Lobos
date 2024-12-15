import axios from 'axios';
import { useEffect, useState } from "react";
import { DataFilters, MapViewOptions, States } from '../../enums';
import GraphContainer from './GraphInfo';

export default function StateSummaryTab({ selectedState, selectedArea, mapView, setMapView }) {
    const [stateInfo, setStateInfo] = useState(null);
    const [dataSetType, setDataSetType] = useState(DataFilters.PARTY)

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
            party: stateInfo.data["Political Party"],
            redistrictingParty: stateInfo.data["Redistricting Party"],
            population: stateInfo.data["Total Population"],
            income: stateInfo.data["Median Household Income"],
            poverty: stateInfo.data["Poverty Rate"],
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
            <StateDetails stateDetails={stateDetails} />
            <GraphContainer
                selectedArea={selectedArea}
                mapView={MapViewOptions.STATE}
                dataSetType={dataSetType}
                setDataSetType={setDataSetType}
            />
        </>
    );
}

function StateDetails({ stateDetails }) {
    return (
        <>
            <div className="flex flex-col items-center justify-center pb-8 montserrat">
                <span className="font-bold pb-2">Redistricting Party</span>
                <span>{stateDetails.redistrictingParty}</span>
            </div>
            <div className="data-component-info ">
                <div className={`data-component-info-stat-box montserrat`}>
                    <span className="font-bold pb-2">Political Lean</span>
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
