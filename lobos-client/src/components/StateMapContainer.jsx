import { States } from "../enums";
import StatesMap from "./MapComponents/StatesMap";

export default function StateMapContainer({ mapView, selectedState, setHoveredArea, setSelectedArea, selectedArea, heatmapOpts, highlightedDistrict }) {
    return (
        <div className="flex items-center justify-center" style={{ width: (selectedState !== States.NONE) ? "40%" : "100%" }}>
            <div className="wrapper">
                <StatesMap
                    selectedState={selectedState}
                    setHoveredArea={setHoveredArea}
                    setSelectedArea={setSelectedArea}
                    selectedArea={selectedArea}
                    mapView={mapView}
                    heatmapOpts={heatmapOpts}
                    highlightedDistrict={highlightedDistrict}
                />
            </div>
        </div>
    )
}