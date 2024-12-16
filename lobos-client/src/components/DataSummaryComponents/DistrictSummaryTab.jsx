import axios from 'axios';
import { useEffect, useState } from "react";
import { DataFilters, MapViewOptions, States } from '../../enums';
import GraphContainer from './GraphInfo';

export default function DistrictSummaryTab({ selectedState, selectedArea, setSelectedArea, mapView, setMapView, setHighlightedDistrict }) {
    const [initLoad, setInitLoad] = useState(false);
    const [districtInfo, setDistrictInfo] = useState(null);
    const [dataSetType, setDataSetType] = useState(DataFilters.PARTY);

    useEffect(() => {
        if (mapView != MapViewOptions.DISTRICT)
            setMapView(MapViewOptions.DISTRICT);
    }, [])

    useEffect(() => {
        if (selectedState !== States.NONE) {
            axios.get(`http://localhost:8080/api/district-info`, {
                params: {
                    state: selectedState
                }
            })
                .then(response => {
                    setDistrictInfo(response.data);

                    const [firstKey, firstEntry] = Object.entries(response.data.representativeData)[0];
                    setSelectedArea(firstKey);

                    setInitLoad(true);
                })
                .catch(error => {
                    console.error("Error Retrieving Info:", error);
                    setInitLoad(true);
                });
        }
    }, []);

    const isInfoUpdated = (districtInfo && districtInfo.state === selectedState)

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                {isInfoUpdated && <CongressionalTable districtInfo={districtInfo} selectedState={selectedState} setHighlightedDistrict={setHighlightedDistrict} />}
            </div>
            <GraphContainer
                selectedArea={selectedArea}
                selectedState={selectedState}
                mapView={MapViewOptions.DISTRICT}
                dataSetType={dataSetType}
                setDataSetType={setDataSetType}
            />
        </>
    )
}

function CongressionalTable({ districtInfo, setHighlightedDistrict }) {
    const handleHover = (name, party) => {
        setHighlightedDistrict({ name: name, party: party })
    };

    const handleLeave = () => {
        setHighlightedDistrict({ name: "N/A", party: "N/A" });
    };

    const districts = Object.entries(districtInfo.representativeData);

    return (
        <div className="table-container">
            <table className="montserrat congress-table">
                <thead>
                    <tr>
                        <th style={{ width: '32px' }}>#</th>
                        <th>Repr. Name</th>
                        <th>Repr. Party</th>
                        <th style={{ textAlign: 'right' }}>Median HH-Income</th>
                        <th style={{ textAlign: 'right' }}>Poverty Rate</th>
                        <th style={{ textAlign: 'right' }}>Region (Urban)</th>
                        <th style={{ textAlign: 'right' }}>Region (Suburban)</th>
                        <th style={{ textAlign: 'right' }}>Region (Rural)</th>
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