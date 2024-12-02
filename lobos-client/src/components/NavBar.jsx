import { GiWolfHead } from "react-icons/gi";
import { States } from "../enums";

export default function NavBar({ hoveredArea, setHoveredArea, setSelectedArea, selectedState }) {
    return (
        <div className="navbar">
            <NavLogo 
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
            />
            <NavTitle
                hoveredArea={hoveredArea}
                selectedState={selectedState}
            />
        </div>
    )
}

function NavLogo({ setHoveredArea, setSelectedArea }) {
    const clearSelection = () => {
        setHoveredArea(States.NONE);
        setSelectedArea(States.NONE);
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
    let showHoverText = selectedState === States.NONE || hoveredArea !== States.NONE;

    return (
        <div className="navbar-title flex flex-col items-center justify-center">
            <span className="text-4xl text-white averia-serif">{(selectedState !== States.NONE) ? selectedState : "[Select A State]"}</span>
            { showHoverText && <span className="text-base text-white averia-serif">{`Hovering: ${(hoveredArea !== States.NONE) ? hoveredArea : "...    "}`}</span> }
        </div>
    )
}