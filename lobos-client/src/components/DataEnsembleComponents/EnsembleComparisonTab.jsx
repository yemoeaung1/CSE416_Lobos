import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import Color from "color";
import { Box, Button, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { States } from "../../enums";


export default function EnsembleComparisonTab({ selectedState }) {
    const [selectedPlan, setSelectedPlan] = useState("None");
    const [planSummary, setPlanSummary] = useState(null);
    const [planGeoJSON, setPlanGeoJSON] = useState(null);

    const [showPlan, setShowPlan] = useState(false);

    useEffect(() => {
        if (selectedState !== States.NONE && selectedPlan !== 'None') {
            axios
                .get(`http://localhost:8080/api/district-plan`, {
                    params: {
                        state: selectedState,
                        name: selectedPlan
                    }
                })
                .then((response) => {
                    const { data, geoJSON, properties } = response.data;
                    setPlanSummary(data)
                    setPlanGeoJSON({ geoJSON, properties });
                })
                .catch((error) => {
                    console.error("Error Retrieving Map:", error);
                });
        }
    }, [selectedPlan]);

    return (
        <>
            <DistrictPlanSelection selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} setShowPlan={setShowPlan} />
            <DistrictPlanSummary planSummary={planSummary} />
            {showPlan && <DistrictPlanPopup planGeoJSON={planGeoJSON} setShowPlan={setShowPlan} />}
        </>
    );
}

function DistrictPlanSelection({ selectedPlan, setSelectedPlan, setShowPlan }) {
    const districtPlans = ["None", "Test District Plan", "District Plan 1", "District Plan 2", "District Plan 3", "District Plan 4", "District Plan 5"]

    const isDisabled = (selectedPlan === 'None');

    return (
        <Box display="flex" alignItems="center">
            <FormControl fullWidth sx={{ mr: 1 }}>
                <InputLabel id="district-plan-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>District Plans</InputLabel>
                <Select
                    labelId="district-plan-dropdown-label"
                    value={selectedPlan}
                    onChange={(event) => setSelectedPlan(event.target.value)}
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

function DistrictPlanSummary({ planSummary }) {
    return (
        <></>
    );
}

function DistrictPlanPopup({ planGeoJSON, setShowPlan }) {
    return (
        <div className="district-plan-popup">
            <IconButton className="district-plan-popup-exit" size="small" component="span" onClick={() => { setShowPlan(false) }}>
                <CloseIcon />
            </IconButton>
            <DistrictPlanMap planGeoJSON={planGeoJSON} />
        </div>
    );
}

function DistrictPlanMap({ planGeoJSON }) {
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