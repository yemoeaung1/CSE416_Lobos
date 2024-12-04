import { GiWolfHead } from "react-icons/gi";
import { MapViewOptions, States } from "../enums";

export default function NavBar({ setMapView, hoveredArea, setHoveredArea, setSelectedArea, selectedState, setHeatmapOpts }) {
    return (
        <div className="navbar">
            <NavLogo 
                setMapView={setMapView}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                setHeatmapOpts={setHeatmapOpts}
            />
            <NavTitle
                hoveredArea={hoveredArea}
                selectedState={selectedState}
            />
        </div>
    )
}

function NavLogo({ setMapView, setHoveredArea, setSelectedArea, setHeatmapOpts }) {
    const clearSelection = () => {
        setMapView(MapViewOptions.STATE);
        setHoveredArea(States.NONE);
        setSelectedArea(States.NONE);
        setHeatmapOpts();
    }

    return (
        <div className="navbar-home text-white p-4">
            <div className="flex flex-row items-center justify-center cursor-pointer hover:bg-red-800 pl-2" onClick={() => clearSelection()}>
                <GiWolfHead size={42} />
                <span className="text-4xl leading-none p-4 averia-serif">Lobos</span>
            </div>
        </div>
    );
}

function NavTitle({ hoveredArea, selectedState }) {
    return (
        <div className="navbar-title flex flex-col items-center justify-center">
            <span className="text-4xl text-white averia-serif">{(selectedState !== States.NONE) ? selectedState : "[Select A State]"}</span>
            <span className="text-base text-white averia-serif">{`Hovering: ${(hoveredArea !== States.NONE) ? hoveredArea : "...    "}`}</span>
        </div>
    )
}