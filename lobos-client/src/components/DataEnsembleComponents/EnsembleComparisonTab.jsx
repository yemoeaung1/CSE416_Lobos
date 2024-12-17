import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import Color from "color";
import { Box, Button, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DataFilters, States } from "../../enums";
import BarGraph from "../GraphPlotComponents/BarGraph";


export default function EnsembleComparisonTab({ selectedState }) {
    const [selectedPlan, setSelectedPlan] = useState("None");
    const [selectedDist, setSelectedDist] = useState(DataFilters.PARTY);
    const [selectedDistrict, setSelectedDistrict] = useState("Congressional District 1");

    const [planGeoJSON, setPlanGeoJSON] = useState(null);
    const [planGraphData, setPlanGraphData] = useState(null);
    const [planPopulationData, setPlanPopulationData] = useState(0);

    const [showPlan, setShowPlan] = useState(false);

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
    }, [selectedPlan, selectedDist]);

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
                setShowPlan={setShowPlan}
                resetStates={resetStates}
            />
            <div className="mt-4 mb-4" />
            <DistrictPlanSummary
                planGraphData={planGraphData}
                planPopulationData={planPopulationData}
                selectedDistrict={selectedDistrict}
                selectedDist={selectedDist}
                setSelectedDist={setSelectedDist}
            />
            {showPlan && <DistrictPlanPopup planGeoJSON={planGeoJSON} setShowPlan={setShowPlan} />}
        </>
    );
}

function DistrictPlanSelection({ selectedState, selectedPlan, setSelectedPlan, setShowPlan, resetStates }) {
    const districtPlans = availablePlans[selectedState];

    const isDisabled = (selectedPlan === 'None');

    return (
        <Box display="flex" alignItems="center">
            <FormControl fullWidth sx={{ mr: 1 }}>
                <InputLabel id="district-plan-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>District Plans</InputLabel>
                <Select
                    labelId="district-plan-dropdown-label"
                    value={selectedPlan}
                    onChange={(event) => {
                        setSelectedPlan(event.target.value);
                        setShowPlan(false);
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
            <div className="pr-2 pl-6">
                <Button
                    onClick={() => setShowPlan(true)}
                    sx={{
                        textTransform: 'none',
                        padding: "2px 4px",
                        fontSize: "1.0rem",
                        fontFamily: "Montserrat, san-serif",
                        fontWeight: "bold",
                        backgroundColor: (!isDisabled) ? "primary.main" : "grey.200",
                        color: (!isDisabled) ? "grey.200" : "primary.main",
                    }}
                    disabled={isDisabled}
                >
                    Compare Plans
                </Button>
            </div>
        </Box>
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
        <div className="data-component-graph-container">
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
            <div className="averia-serif text-base pl-1">{`${selectedDistrict}`}</div>
            <div className="averia-serif text-lg pt-8 pb-1 font-bold pl-1">{`Total Population:`}</div>
            <div className="averia-serif text-base pl-1">{`${planPopulationData.toLocaleString()}`}</div>
        </div>
    );
}

function DistrictPlanPopup({ planGeoJSON, setShowPlan }) {
    return (
        <div className="district-plan-popup flex flex-end">
            <IconButton className="district-plan-popup-exit" size="small" component="span" onClick={() => { setShowPlan(false) }}>
                <CloseIcon />
            </IconButton>
            <DistrictPlanMap planGeoJSON={planGeoJSON} />
        </div>
    );
}

function DistrictPlanMap({ planGeoJSON }) {
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

const availablePlans = Object.freeze({
    "Utah": ["None"],
    "South Carolina": ["None", "Test District Plan"],
})