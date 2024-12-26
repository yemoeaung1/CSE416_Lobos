import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import DataContainer from "./components/DataContainer";
import StateMapContainer from "./components/StateMapContainer";
import { DataTabOptions, HeatMapFilters, MapViewOptions, States } from "./enums";

function App() {
    const [isLoading, setIsLoading] = useState(false);

    const [hoveredArea, setHoveredArea] = useState(null);
    const [selectedArea, setSelectedArea] = useState(States.NONE);
    const [selectedState, setSelectedState] = useState(States.NONE);

    const [mapView, setMapView] = useState(MapViewOptions.NONE);
    const [heatmapOpts, setHeatmapOpts] = useState([HeatMapFilters.NONE]);
    const [highlightedDistrict, setHighlightedDistrict] = useState(0);

    const [dataTab, setDataTab] = useState(DataTabOptions.SUMMARY);

    useEffect(() => {
        if (Object.values(States).includes(selectedArea) && selectedState !== selectedArea){
            setSelectedState(selectedArea);
            setDataTab(DataTabOptions.SUMMARY);
        }
    }, [selectedArea]);

    return (
        <div>
            <NavBar
                isLoading={isLoading}
                setMapView={setMapView}
                hoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedState={selectedState}
                setDataTab={setDataTab}
                setHeatmapOpts={setHeatmapOpts}
            />
            <DataContainer
                isLoading={isLoading}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                selectedState={selectedState}
                hoveredArea={hoveredArea}
                mapView={mapView}
                setMapView={setMapView}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
                dataTab={dataTab}
                setDataTab={setDataTab}
                setHighlightedDistrict={setHighlightedDistrict}
            />
            <StateMapContainer
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                mapView={mapView}
                setMapView={setMapView}
                selectedState={selectedState}
                hoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                heatmapOpts={heatmapOpts}
                highlightedDistrict={highlightedDistrict}
            />
        </div>
    );
}

export default App;
