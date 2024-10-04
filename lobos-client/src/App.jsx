import { useEffect, useState, useRef } from "react";
import "./App.css";
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";
import MapLayerSelector from "./components/MapLayerSelector";
import DataContainer from "./components/DataContainer"
import BarGraph from "./components/barGraph";
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot";
import BoxPlotGraph from "./components/boxPlotGraph";
import LineGraph from "./components/lineGraph";

function App() {
  const [selectedArea, setSelectedArea] = useState('none');
  const [mapView, setMapView] = useState('State');
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if(selectedArea !== 'none' && !isOpen)
      setIsOpen(true);
    else if(selectedArea === 'none' && isOpen)
      setIsOpen(false);
  }, [selectedArea]);

  console.log(selectedArea);
  console.log(mapView);

  return (
    <div>
      <NavBar selectedArea={selectedArea} setMapView={setMapView} setSelectedArea={setSelectedArea} />
      <DataContainer isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="wrapper" style={{
        width: selectedArea !== 'none' ? '38%' : '98%'
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
