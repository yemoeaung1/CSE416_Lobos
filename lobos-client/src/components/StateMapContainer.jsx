import { useState } from "react";
import MapLayerSelector from "./MapComponents/MapLayerSelector";
import StatesMap from "./MapComponents/StatesMap";

export default function StateMapContainer({ mapView, setMapView, selectedState, setHoveredArea, setSelectedArea, selectedArea, isOpen, filter, setIsOpen }) {
    return (
        <div className="wrapper" style={{ width: isOpen ? "38%" : "98%" }}>
            <StatesMap
                selectedState={selectedState}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                mapView={mapView}
                isOpen={isOpen}
                filter={filter}
                setIsOpen={setIsOpen}
            />
            {isOpen && (
                <MapLayerSelector
                    setMapView={setMapView}
                    state={selectedArea}
                />
            )}
        </div>
    )
}