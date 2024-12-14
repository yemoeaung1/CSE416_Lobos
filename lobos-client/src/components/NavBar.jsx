import { GiWolfHead } from "react-icons/gi";
import { HeatMapFilters, MapViewOptions, States } from "../enums";

export default function NavBar({ isLoading, setMapView, hoveredArea, setHoveredArea, setSelectedArea, selectedState, setHeatmapOpts }) {
    return (
        <div className="navbar">
            <NavLogo 
                isLoading={isLoading}
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

function NavLogo({ isLoading, setMapView, setHoveredArea, setSelectedArea, setHeatmapOpts }) {
    const clearSelection = () => {
        if(isLoading){
            console.log("Loading Failure: Resetting Page");
            return;
        }

        setMapView(MapViewOptions.STATE);
        setHoveredArea(null);
        setSelectedArea(States.NONE);
        setHeatmapOpts([HeatMapFilters.NONE]);
    }

    return (
        <div className="navbar-home text-white">
            <span className="flex flex-row items-center justify-center cursor-pointer hover:bg-red-800 p-4" onClick={() => clearSelection()}>
                <GiWolfHead size={42} />
                <span className="text-4xl pl-4 averia-serif">Lobos</span>
            </span>
            <span className={`loading-circle ${isLoading ? "loading" : 0} ml-4`}/>
        </div>
    );
}

function NavTitle({ hoveredArea, selectedState }) {
    return (
        <div className="navbar-title flex flex-col items-center justify-center">
            <span className="text-4xl text-white averia-serif-title">{(selectedState !== States.NONE) ? selectedState : "[Select A State]"}</span>
            <span className="text-base text-white averia-serif-title">{`Hovering: ${(hoveredArea !== null) ? (hoveredArea.properties.NAME) : "..."}`}</span>
        </div>
    )
}