import { useEffect, useState, useRef } from "react";
import "./App.css";
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";
import MapLayerSelector from "./components/MapLayerSelector";
import DataContainer from "./components/DataContainer";

function App() {
  const [selectedArea, setSelectedArea] = useState("none");
  const [mapView, setMapView] = useState("State");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedArea !== "none" && !isOpen) setIsOpen(true);
    else if (selectedArea === "none" && isOpen) setIsOpen(false);
  }, [selectedArea]);

  console.log(selectedArea);
  console.log(mapView);

  return (
    <div>
      <NavBar setMapView={setMapView} setSelectedArea={setSelectedArea} selectedArea={selectedArea} />
      <DataContainer setIsOpen={setIsOpen} isOpen={isOpen}/>
      <div
        className="wrapper"
        style={{
          width: selectedArea !== "none" ? "38%" : "98%",
        }}
      >
        <StatesMap
          setSelectedArea={setSelectedArea}
          selectedArea={selectedArea}
          mapView={mapView}
          isOpen={isOpen}
        />
        {selectedArea != "none" && (
          <MapLayerSelector setMapView={setMapView} state={selectedArea} />
        )}
      </div>
    </div>
  );
}

export default App;
