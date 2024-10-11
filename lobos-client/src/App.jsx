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
    const [selectedState, setSelectedState] = useState("none");
    const [selectedArea, setSelectedArea] = useState("none");
    const [mapView, setMapView] = useState("State");

    const [isOpen, setIsOpen] = useState(false);

    const [dataTool, setDataTool] = useState("");

    const [filter, setFilter] = useState();

    useEffect(() => {
        if (selectedArea == 'Utah' || selectedArea == 'South Carolina' || selectedArea == 'none') {
            setSelectedState(selectedArea);

            if(selectedArea != 'none')
                setDataTool("info");
        }

        if (selectedArea !== "none" && !isOpen) setIsOpen(true);
        else if (selectedArea === "none" && isOpen) setIsOpen(false);
    }, [selectedArea]);

    console.log(selectedArea);
    console.log(mapView);

    return (
        <div>
            <NavBar selectedState={selectedState} setSelectedArea={setSelectedArea} />
            <DataContainer
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedArea={selectedArea}
                selectedState={selectedState}
                dataTool={dataTool}
                setDataTool={setDataTool}
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
