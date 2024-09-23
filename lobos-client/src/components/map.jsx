import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import states from '../geojson/states.json'

const SimpleMap = () => {
    // useRef allows you to have more control and flexibility over the map instance
    const mapRef = useRef(null);
    const [selectedState, setSelectedState] = useState(null);
    const latitude = 36;
    const longitude = -92;
    
    const onEachState = (state, layer) => {

      layer.setStyle({
        fillColor: "#ff6961",
        fillOpacity: 0.5,
        color: "black",
        weight: 1,
      });
  
      // Optionally, you can bind popups or handle mouse events here
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({ fillColor: "#9b111e" });
        },
        mouseout: (e) => {
          e.target.setStyle({ fillColor: "#ff6961" });
        },
        click: (e) => {
          console.log(e.target.feature.properties.NAME);
          setSelectedState(e.target.feature.properties.NAME);
          // setCurrentState(e.target);
        }
      });
    };
  
    return ( 
      <div className="relative">
        <MapContainer center={[latitude, longitude]} zoom={5} ref={mapRef} style={{height: "100vh", width: "100vw", zIndex: 1}} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={states} onEachFeature={onEachState}/>
          {/* Additional map layers or components can be added here */}
        </MapContainer>
        <div className="fixed w-48 h-12 top-20 left-0 bg-white z-50 font-bold text-lg text-center p-2">
          {selectedState === null ? 'State Not Selected' : selectedState}
        </div>
      </div>
      
    );
  };
  
  export default SimpleMap;