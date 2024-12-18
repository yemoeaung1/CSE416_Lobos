import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import PrecinctDataTable from "../GraphPlotComponents/PrecinctDataTable";
import VoteShareSeatShareGraph from "../GraphPlotComponents/VoteShareSeatShareGraph";
import { FormControlLabel, Checkbox } from "@mui/material";
import { MapViewOptions } from "../../enums";
import { Tooltip } from "@mui/material";
import { GinglesButtons, GinglesCurve, GinglesTab, GinglesTable } from "./GinglesTab";

export default function AnalysisTab({ selectedState, mapView, setMapView }) {
    const [selectedChart, setSelectedChart] = useState(ChartSelection.GINGLES_PRECINCT_ANALYSIS);

    useEffect(() => {
        if (mapView != MapViewOptions.PRECINCT)
            setMapView(MapViewOptions.PRECINCT);
    }, []);

    return (
        <div className='data-component-container'>
            <div className="flex flex-col h-full">
                <TabSelector selectedChart={selectedChart} setSelectedChart={setSelectedChart} />

                {selectedChart === ChartSelection.GINGLES_PRECINCT_ANALYSIS &&
                    <GinglesTab selectedState={selectedState} />
                }

                {selectedChart === ChartSelection.ECOLOGICAL_INFERENCE &&
                    <GinglesTab selectedState={selectedState} />
                }
            </div>
        </div>
    );
}

function TabSelector({ selectedChart, setSelectedChart }) {
    const tabStyle = {
        cursor: "pointer",
        paddingBottom: "4px",
        marginRight: "8px",
        fontSize: "16px",
        transition: "color 0.3s ease",
        color: "#6b7280",
        borderBottom: "2px solid transparent",
    };

    const activeTabStyle = {
        ...tabStyle,
        color: "#2563eb",
        borderBottom: "4px solid #2563eb",
    };

    return (
        <nav
            className="flex justify-end mb-4 space-x-8 border-b-2 border-gray-300"
            style={{ borderBottom: "2px solid #e5e7eb" }}
        >
            <div
                style={
                    selectedChart === ChartSelection.GINGLES_PRECINCT_ANALYSIS
                        ? activeTabStyle
                        : tabStyle
                }
                onClick={() => setSelectedChart(ChartSelection.GINGLES_PRECINCT_ANALYSIS)}
            >
                Gingles 2/3
            </div>
            <div
                style={
                    selectedChart === ChartSelection.ECOLOGICAL_INFERENCE
                        ? activeTabStyle
                        : tabStyle
                }
                onClick={() => setSelectedChart(ChartSelection.ECOLOGICAL_INFERENCE)}
            >
                Ecological Inference
            </div>
        </nav>
    )
}

const ChartSelection = Object.freeze({
    GINGLES_PRECINCT_ANALYSIS: "gingles_precinct_analysis",
    ECOLOGICAL_INFERENCE: "ecological_inference",
})