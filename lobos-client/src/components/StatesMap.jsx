import { MapContainer, useMap, TileLayer, Pane, GeoJSON } from "react-leaflet";
import sc_state from '../geojson/South_Carolina/sc_state.json'
import utah_state from '../geojson/Utah/utah_state.json'
import { useEffect, useState } from "react";

const StatesMap = ( { selectedArea, setSelectedArea }) => {
    const [display, setDisplay] = useState([]);

    useEffect(() => {
        const initialDisplay = {
            "type" : "FeatureCollection",
            "features": [sc_state, utah_state]
        }
        setDisplay(['both', initialDisplay]);
    }, []);

    /**
    * ? does the hover effect but don't know if this is the best place to show popups 
    **/

    const onEachFeature= (feature, layer)=> {
        layer.setStyle({
            fillColor: "#ff6961",
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
          });
        // console.log(feature);
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillColor: "#9b111e" });
              },
            mouseout:(e) => {
                e.target.setStyle({ fillColor: "#ff6961" });
              },
            click: (e) => {
                // console.log(feature.p);
                setSelectedArea(feature.properties.NAME);
            }
        });
    }

  return (
    <MapContainer center={[36, -92]} zoom={5} style={{ height: "89vh", zIndex: 1}}>
    <MapController selectedArea={selectedArea}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Pane name="labels" style={{ zIndex: 650 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        />
      </Pane>

      <GeoJSON key={display[0]} data={display[1]} onEachFeature={onEachFeature}/>
    </MapContainer>
  );
};

const MapController = ( {selectedArea }) => {
  const map = useMap();

  if(selectedArea === 'South Carolina') {
    console.log("map", map.getCenter());
    map.flyTo([33.8176231,-78.2079802], 7.75, {
        animate: true,
        duration: 1,
    });
  } else if (selectedArea === 'Utah') {
    map.flyTo([39.7659401,-106.8108964], 7, {
        animate: true,
        duration: 1,
    });
  }
  return <></>;
};

export default StatesMap;
