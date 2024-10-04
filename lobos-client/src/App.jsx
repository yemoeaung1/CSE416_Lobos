import { useEffect, useState, useRef } from "react";
import "./App.css";
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";
import MapLayerSelector from "./components/MapLayerSelector";
import DataContainer from "./components/DataContainer";
import BarGraph from "./components/barGraph";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import BoxPlotGraph from "./components/boxPlotGraph";
import LineGraph from "./components/lineGraph";

function App() {
    const [selectedArea, setSelectedArea] = useState("none");
    const [mapView, setMapView] = useState("State");

    const [isOpen, setIsOpen] = useState(false);

    const [filter, setFilter] = useState();

    useEffect(() => {
        if (selectedArea !== "none" && !isOpen) setIsOpen(true);
        else if (selectedArea === "none" && isOpen) setIsOpen(false);
    }, [selectedArea]);

    console.log(selectedArea);
    console.log(mapView);

    return (
        <div>
            <NavBar selectedArea={selectedArea} setSelectedArea={setSelectedArea}/>
            <DataContainer
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedArea={selectedArea}
                setFilter={setFilter}
            />
            <div
                className="wrapper"
                style={{
                    width: isOpen ? "38%" : "98%",
                }}
            >
                <StatesMap
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

            {/* <BoxPlotGraph/>
      <BarGraph/>
      <LineGraph/> */}
        </div>
    );
}

export default App;
