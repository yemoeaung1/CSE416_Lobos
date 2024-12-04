import StatesMap from "./MapComponents/StatesMap";

export default function StateMapContainer({ mapView, selectedState, setHoveredArea, setSelectedArea, selectedArea, isOpen, setIsOpen, heatmapOpts, highlightedDistrict }) {
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
                    setIsOpen={setIsOpen}
                    heatmapOpts={heatmapOpts}
                    highlightedDistrict={highlightedDistrict}
                />
            </div>
        </div>
    )
}