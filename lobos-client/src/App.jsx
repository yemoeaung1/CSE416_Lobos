import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import DataContainer from "./components/DataContainer";
import StateMapContainer from "./components/StateMapContainer";
import { DataTabOptions, MapViewOptions, States } from "./enums";

function App() {
    const [isOpen, setIsOpen] = useState(false);

    const [mapView, setMapView] = useState(MapViewOptions.STATE);
    const [heatmapOpts, setHeatmapOpts] = useState(null);

    const [hoveredArea, setHoveredArea] = useState(States.NONE);
    const [selectedArea, setSelectedArea] = useState(States.NONE);
    const [selectedState, setSelectedState] = useState(States.NONE);

    const [dataTab, setDataTab] = useState(DataTabOptions.SUMMARY);
    const [highlightedDistrict, setHighlightedDistrict] = useState(0);

    useEffect(() => {
        if (selectedState !== selectedArea && Object.values(States).includes(selectedArea)){
            setSelectedState(selectedArea);
            setDataTab(DataTabOptions.SUMMARY);
        }

        if (selectedArea !== States.NONE && !isOpen)
            setIsOpen(true);
        else if (selectedArea === States.NONE && isOpen)
            setIsOpen(false);
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
                isOpen={isOpen}
                setIsOpen={setIsOpen}
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
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                heatmapOpts={heatmapOpts}
                highlightedDistrict={highlightedDistrict}
            />
        </div>
    );
}

export default App;
