import { useState } from "react";
import MapLayerSelector from "./MapComponents/MapLayerSelector";
import StatesMap from "./MapComponents/StatesMap";

export default function StateMapContainer({ mapView, setMapView, selectedState, setHoveredArea, setSelectedArea, selectedArea, isOpen, filter, setIsOpen }) {
    return (
        <div className="flex items-center justify-center" style={{ width: isOpen ? "40%" : "100%" }}>
            <div className="wrapper" style={{ width: "98%" }}>
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
                        mapView={mapView}
                        setMapView={setMapView}
                    />
                )}
            </div>
        </div>
    )
}