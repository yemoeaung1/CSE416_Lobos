import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import DataContainer from "./components/DataContainer";
import StateMapContainer from "./components/StateMapContainer";
import { States } from "./enums";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState();

    const [hoveredArea, setHoveredArea] = useState(States.NONE);
    const [selectedArea, setSelectedArea] = useState(States.NONE);
    const [selectedState, setSelectedState] = useState(States.NONE);

    useEffect(() => {
        if (Object.values(States).includes(selectedArea))
            setSelectedState(selectedArea);

        if (selectedArea !== States.NONE && !isOpen)
            setIsOpen(true);
        else if (selectedArea === States.NONE && isOpen)
            setIsOpen(false);
    }, [selectedArea]);

    return (
        <div>
            <NavBar
                hoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedState={selectedState}
            />
            <DataContainer
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedArea={selectedArea}
                selectedState={selectedState}
                setFilter={setFilter}
            />
            <StateMapContainer
                selectedState={selectedState}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                isOpen={isOpen}
                filter={filter}
                setIsOpen={setIsOpen}
            />
        </div>
    );
}

export default App;
