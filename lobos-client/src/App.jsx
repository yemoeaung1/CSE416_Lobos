import { useEffect, useState } from "react";
import "./App.css";
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";
import MapLayerSelector from "./components/MapLayerSelector";

function App() {
  const [selectedArea, setSelectedArea] = useState('none');
  const [mapView, setMapView] = useState('State');

  console.log(selectedArea);
  console.log(mapView);

  return (
    <div>
      <NavBar setMapView={setMapView} setSelectedArea={setSelectedArea} />
      <div className="wrapper">
        <StatesMap
          setSelectedArea={setSelectedArea}
          selectedArea={selectedArea}
          mapView={mapView}
        />
        {selectedArea != 'none' && <MapLayerSelector setMapView={setMapView} state={selectedArea}/>}
      </div>
    </div>
  );
}

export default App;
