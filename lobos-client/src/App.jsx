import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import DataContainer from "./components/DataContainer";
import StateMapContainer from "./components/StateMapContainer";
import { DataTabOptions, MapViewOptions, States } from "./enums";

function App() {
    const [isLoading, setIsLoading] = useState(false);

    const [hoveredArea, setHoveredArea] = useState(States.NONE);
    const [selectedArea, setSelectedArea] = useState(States.NONE);
    const [selectedState, setSelectedState] = useState(States.NONE);

    const [mapView, setMapView] = useState(MapViewOptions.STATE);
    const [districtYear, setDistrictYear] = useState('2020');
    const [heatmapOpts, setHeatmapOpts] = useState(null);
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
                selectedState={selectedState}
                mapView={mapView}
                setMapView={setMapView}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
                dataTab={dataTab}
                setDataTab={setDataTab}
                districtYear={districtYear}
                setDistrictYear={setDistrictYear}
                setHighlightedDistrict={setHighlightedDistrict}
            />
            <StateMapContainer
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                mapView={mapView}
                setMapView={setMapView}
                selectedState={selectedState}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                heatmapOpts={heatmapOpts}
                districtYear={districtYear}
                highlightedDistrict={highlightedDistrict}
            />
        </div>
    );
}

export default App;
