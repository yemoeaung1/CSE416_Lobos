import axios from 'axios';
import { useEffect, useState } from "react";
import { DataFilters, MapViewOptions, States } from '../../enums';
import GraphContainer from './GraphInfo';

export default function StateSummaryTab({ selectedState, selectedArea, setSelectedArea, mapView, setMapView }) {
    const [initLoad, setInitLoad] = useState(false);
    const [stateInfo, setStateInfo] = useState(null);
    const [dataSetType, setDataSetType] = useState(DataFilters.PARTY)

    useEffect(() => {
        if (mapView != MapViewOptions.STATE)
            setMapView(MapViewOptions.STATE);

        if (selectedState != selectedArea)
            setSelectedArea(selectedState);

        setInitLoad(true);
    }, [])

    useEffect(() => {
        if (selectedState !== States.NONE) {
            axios.get(`http://localhost:8080/api/state-info`, {
                params: {
                    state: selectedState
                }
            })
                .then(response => {
                    setStateInfo(response.data);
                })
                .catch(error => {
                    console.error("Error Retrieving Info:", error);
                });
        }
    }, []);

    const isInfoUpdated = (stateInfo && stateInfo.state === selectedState)

    let stateDetails = isInfoUpdated
        ? {
            party: stateInfo.data["party"],
            redistrictingParty: stateInfo.data["redistrictingParty"],
            population: stateInfo.data["totalPopulation"],
            income: stateInfo.data["medianIncome"],
            poverty: stateInfo.data["povertyRate"],
            densityMI: stateInfo.data["densityMi"],
            densityKM: stateInfo.data["densityKm"],
            districts: stateInfo.data["totalDistricts"],
            precincts: stateInfo.data["totalPrecincts"],
        }
        : {
            party: "Loading...",
            redistrictingParty: "Loading...",
            population: "Loading...",
            income: "Loading...",
            poverty: "Loading...",
            densityMI: "Loading...",
            densityKM: "Loading...",
            districts: "Loading...",
            precincts: "Loading...",
        }

    return (
        <>
            <StateDetails stateDetails={stateDetails} />
            <GraphContainer
                selectedArea={selectedArea}
                selectedState={selectedState}
                mapView={MapViewOptions.STATE}
                dataSetType={dataSetType}
                setDataSetType={setDataSetType}
            />
        </>
    );
}

function StateDetails({ stateDetails }) {
    return (
        <div className="data-component-info-grid">
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Population</div>
                <div>{`${stateDetails.population.toLocaleString()}`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Population Density</div>
                <div>{`${stateDetails.densityMI} per sq mile`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Political Lean</div>
                <div>{`${stateDetails.party}`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Redistricting Party</div>
                <div>{stateDetails.redistrictingParty}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Median HH Income</div>
                <div>{`$${stateDetails.income.toLocaleString()}`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1">Poverty Rate</div>
                <div>{`${stateDetails.poverty}%`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1"># of Districts</div>
                <div>{`${stateDetails.districts}`}</div>
            </div>
            <div className="data-component-info-grid-cell montserrat">
                <div className="font-bold pb-1"># of Precincts</div>
                <div>{`${stateDetails.precincts}`}</div>
            </div>
        </div>
    );
}
