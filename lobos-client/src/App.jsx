import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import DataContainer from "./components/DataContainer";
import StateMapContainer from "./components/StateMapContainer";
import { DataTabOptions, MapViewOptions, States } from "./enums";

function App() {

    const [hoveredArea, setHoveredArea] = useState(States.NONE);
    const [selectedArea, setSelectedArea] = useState(States.NONE);
    const [selectedState, setSelectedState] = useState(States.NONE);

    const [highlightedDistrict, setHighlightedDistrict] = useState(0);
    const [mapView, setMapView] = useState(MapViewOptions.STATE);
    const [heatmapOpts, setHeatmapOpts] = useState(null);

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
                setMapView={setMapView}
                hoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedState={selectedState}
                setDataTab={setDataTab}
                setHeatmapOpts={setHeatmapOpts}
            />
            <DataContainer
                selectedArea={selectedArea}
                selectedState={selectedState}
                setMapView={setMapView}
                setHeatmapOpts={setHeatmapOpts}
                dataTab={dataTab}
                setDataTab={setDataTab}
                setHighlightedDistrict={setHighlightedDistrict}
            />
            <StateMapContainer
                mapView={mapView}
                selectedState={selectedState}
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
