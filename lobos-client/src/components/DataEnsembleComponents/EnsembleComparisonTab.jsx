import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import Color from "color";
import { IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { DataFilters, States } from "../../enums";
import BarGraph from "../GraphPlotComponents/BarGraph";


export default function EnsembleComparisonTab({ selectedState }) {
    const [selectedPlan, setSelectedPlan] = useState("None");
    const [selectedDist, setSelectedDist] = useState(DataFilters.PARTY);
    const [selectedDistrict, setSelectedDistrict] = useState("Congressional District 1");

    const [planGeoJSON, setPlanGeoJSON] = useState(null);
    const [planGraphData, setPlanGraphData] = useState(null);
    const [planPopulationData, setPlanPopulationData] = useState(0);

    const [fullMapView, setFullMapView] = useState(false);
    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, [fullMapView]);

    useEffect(() => {
        if (selectedState !== States.NONE && selectedPlan !== 'None') {
            axios
                .get(`http://localhost:8080/api/district-plan-geo`, {
                    params: {
                        state: selectedState,
                        name: selectedPlan
                    }
                })
                .then((response) => {
                    const { geoJSON, properties } = response.data;
                    setPlanGeoJSON({ geoJSON, properties });
                })
                .catch((error) => {
                    console.error("Error Retrieving District Plan GeoJSON:", error);
                });
        }
    }, [selectedPlan]);

    useEffect(() => {
        if (selectedState !== States.NONE && selectedPlan !== 'None') {
            axios
                .get(`http://localhost:8080/api/district-plan-graph`, {
                    params: {
                        state: selectedState,
                        name: selectedPlan,
                        area: selectedDistrict,
                        filter: selectedDist
                    }
                })
                .then((response) => {
                    const { labels, dataSets, title, ylabel } = response.data.data;

                    setPlanPopulationData(response.data.population);
                    setPlanGraphData({
                        labels,
                        datasets: dataSets.map((dataSet) => ({
                            label: dataSet.label,
                            data: dataSet.data,
                            backgroundColor: dataSet.backgroundColor,
                            borderColor: dataSet.borderColor,
                            borderWidth: dataSet.borderWidth,
                        })),
                        title: title,
                        yTitle: ylabel,
                    });
                })
                .catch((error) => {
                    console.error("Error Retrieving District Plan Data:", error);
                });
        }
    }, [selectedPlan, selectedDist, selectedDistrict]);

    const resetStates = () => {
        setSelectedDist(DataFilters.PARTY);
        setSelectedDistrict("Congressional District 1");

        setPlanGeoJSON(null);
        setPlanGraphData(null);
        setPlanPopulationData(0);
    }

    return (
        <>
            <DistrictPlanSelection
                selectedState={selectedState}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                resetStates={resetStates}
            />
            <div className="mt-4 mb-4" />
            <DistrictPlanContent
                planGraphData={planGraphData}
                planPopulationData={planPopulationData}
                selectedDistrict={selectedDistrict}
                selectedDist={selectedDist}
                setSelectedDist={setSelectedDist}
                planGeoJSON={planGeoJSON}
                setSelectedDistrict={setSelectedDistrict}
                fullMapView={fullMapView}
                setFullMapView={setFullMapView}
                mapRef={mapRef}
            />
        </>
    );
}

function DistrictPlanSelection({ selectedState, selectedPlan, setSelectedPlan, resetStates }) {
    const districtPlans = availablePlans[selectedState];

    return (
        <FormControl fullWidth sx={{ mr: 1 }}>
            <InputLabel id="district-plan-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>District Plans</InputLabel>
            <Select
                labelId="district-plan-dropdown-label"
                value={selectedPlan}
                onChange={(event) => {
                    setSelectedPlan(event.target.value);
                    resetStates();
                }}
                label="District Plans"
                sx={{
                    fontFamily: "Montserrat, san-serif",
                }}
            >
                {districtPlans.map((option, index) => (
                    <MenuItem key={index} value={option} sx={{ fontFamily: "Montserrat, san-serif" }}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function DistrictPlanContent({ planGraphData, planPopulationData, selectedDistrict, selectedDist, setSelectedDist, planGeoJSON, setSelectedDistrict, fullMapView, setFullMapView, mapRef }) {
    return (
        <div className="flex flex-row h-full">
            <DistrictPlanPopup
                planGeoJSON={planGeoJSON}
                setSelectedDistrict={setSelectedDistrict}
                fullMapView={fullMapView}
                setFullMapView={setFullMapView}
                mapRef={mapRef}
            />
            {!fullMapView &&
                < DistrictPlanSummary
                    planGraphData={planGraphData}
                    planPopulationData={planPopulationData}
                    selectedDistrict={selectedDistrict}
                    selectedDist={selectedDist}
                    setSelectedDist={setSelectedDist}
                />
            }
        </div>
    );
}
function DistrictPlanPopup({ planGeoJSON, setSelectedDistrict, fullMapView, setFullMapView, mapRef }) {
    if (!planGeoJSON)
        return;

    return (
        <div className={`district-plan-popup ${(fullMapView) ? "full-view" : "half-view"}`}>
            <IconButton className="district-plan-popup-expand" size="small" component="span" onClick={() => { setFullMapView(!fullMapView) }}>
                {!fullMapView && <FullscreenIcon />}
                {fullMapView && <FullscreenExitIcon />}
            </IconButton>
            <DistrictPlanMap planGeoJSON={planGeoJSON} setSelectedDistrict={setSelectedDistrict} mapRef={mapRef} />
        </div>
    );
}

function DistrictPlanMap({ planGeoJSON, setSelectedDistrict, mapRef }) {
    if (planGeoJSON === null || planGeoJSON.geoJSON === null || planGeoJSON.properties === null)
        return;

    const onEachFeature = (feature, layer) => {
        let originalColor = "#FFFFFF";

        const darkerColor = Color(originalColor).darken(0.25).hex();

        layer.setStyle({
            fillColor: originalColor,
            fillOpacity: feature.properties.FOPACITY || 0.75,
            color: feature.properties.COLOR || "#000000",
            weight: 1,
        });

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillColor: darkerColor, weight: 3 });
            },
            mouseout: (e) => {
                e.target.setStyle({ fillColor: originalColor, weight: 1 });
            },
            click: (e) => {
                setSelectedDistrict(feature.properties.NAME);
            }
        });
    };

    return (
        <>
            <MapContainer
                className="district-plan-map"
                preferCanvas={true}
                maxBoundsViscosity={1}
                center={planGeoJSON.properties.CENTER}
                maxBounds={planGeoJSON.properties.MAX_BOUNDS}
                zoom={planGeoJSON.properties.CURRENT_ZOOM}
                minZoom={planGeoJSON.properties.MIN_ZOOM}
                maxZoom={planGeoJSON.properties.MAX_ZOOM}
                ref={mapRef}
            >
                <GeoJSON
                    key={JSON.stringify(planGeoJSON.geoJSON)}
                    data={planGeoJSON.geoJSON}
                    onEachFeature={onEachFeature}
                    zIndex={1}
                />
            </MapContainer>
        </>
    );
}

function DistrictPlanSummary({ planGraphData, planPopulationData, selectedDistrict, selectedDist, setSelectedDist }) {
    if (!planGraphData) {
        return (
            <div className="montserrat text-xl pl-2">
                No Selected District Plan
            </div>
        );
    }

    return (
        <div className="district-plan-summary">
            <DistrictPlanDistributionSelection
                selectedDistrict={selectedDistrict}
                selectedDist={selectedDist}
                setSelectedDist={setSelectedDist}
                planPopulationData={planPopulationData}
            />
            <BarGraph
                graphData={planGraphData}
            />
        </div>
    );
}

function DistrictPlanDistributionSelection({ selectedDistrict, selectedDist, setSelectedDist, planPopulationData }) {
    const graphOptions = [DataFilters.PARTY, DataFilters.RACE, DataFilters.MINORITY, DataFilters.INCOME, DataFilters.REGION_TYPE];

    return (
        <div className="data-component-graph-selection">
            <FormControl>
                <InputLabel id="graph-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>Graph Options</InputLabel>
                <Select
                    labelId="graph-dropdown-label"
                    value={selectedDist}
                    onChange={(event) => setSelectedDist(event.target.value)}
                    label="Graph Options"
                    sx={{
                        minWidth: '196px',
                        fontFamily: "Montserrat, san-serif",
                    }}
                >
                    {graphOptions.map((option, index) => (
                        <MenuItem key={index} value={option} sx={{ fontFamily: "Montserrat, san-serif" }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className="averia-serif text-lg pt-2 pb-1 pl-1 font-bold">{`Selected District:`}</div>
            <div className="averia-serif text-base pl-1 pb-4">{`${selectedDistrict}`}</div>
            <div className="averia-serif text-lg pb-1 font-bold pl-1">{`Total Population:`}</div>
            <div className="averia-serif text-base pl-1 pb-4">{`${planPopulationData.toLocaleString()}`}</div>
        </div>
    );
}

const availablePlans = Object.freeze({
    "Utah": ["None", "Utah-Urban", "Utah-Suburban", "Utah-Rural", "Utah-Republican", "Utah-Poor", "Utah-Black"],
    "South Carolina": ["None",  "South Carolina-Democratic", "South Carolina-Poor", "South Carolina-Republican","South Carolina-Rural","South Carolina-Suburban", "South Carolina-Urban", "Black Plan"],
})