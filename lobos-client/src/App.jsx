import { useEffect, useState, useRef } from "react";
import "./App.css";
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";
import MapLayerSelector from "./components/MapLayerSelector";
import BarGraph from "./components/barGraph";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import BoxPlotGraph from "./components/boxPlotGraph";
import LineGraph from "./components/lineGraph";
import DataContainer from "./components/DataContainer";

function App() {
  const [selectedArea, setSelectedArea] = useState('none');
  const [mapView, setMapView] = useState('State');

  console.log(selectedArea);
  console.log(mapView);

  return (
    <div>
      <NavBar setMapView={setMapView} setSelectedArea={setSelectedArea} />
      <DataContainer />

      <div className="wrapper" style={{
        width: selectedArea !== 'none' ? '40%' : '100%'
      }}>
        <StatesMap
          setSelectedArea={setSelectedArea}
          selectedArea={selectedArea}
          mapView={mapView}
        />
        {selectedArea != 'none' && <MapLayerSelector setMapView={setMapView} state={selectedArea}/>}
      </div>

      {/* <BoxPlotGraph/>
      <BarGraph/>
      <LineGraph/> */}
    </div>
  );
}

export default App;
