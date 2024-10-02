import { MapContainer, useMap, TileLayer, Pane, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import views from "../views";
import CongressionalDistrictMap from "./CongressionalDistrictMap";
import CountyMap from "./CountyMap";
import PrecinctMap from "./PrecinctMap";
import Color from "color";
// import M from "./MapViews";

const StatesMap = ( { selectedArea, setSelectedArea, mapView }) => {
    console.log({selectedArea, mapView});
    // console.log(views['both'][mapView]);
    const [display, setDisplay] = useState([mapView, views['none'][mapView.toLowerCase()]]);

    useEffect(() => {
      console.log('Display updated:', display);
    }, [display]);

    useEffect(() => {
      console.log(views[selectedArea][mapView.toLowerCase()]);
      setDisplay([mapView, views[selectedArea][mapView.toLowerCase()]]);
    }, [selectedArea, mapView]);

    /**
    * ? does the hover effect but don't know if this is the best place to show popups 
    **/
   let originalColor;

    const onEachFeature= (feature, layer)=> {
        layer.setStyle({
            fillColor: "#ff6961",
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
          });
        console.log(feature);
        layer.on({
          mouseover: (e) => {
            originalColor = e.target.options.fillColor;
            const darkerColor = Color(originalColor).darken(0.2).hex(); // Darken by 20%
            e.target.setStyle({ fillColor: darkerColor });
          },
          // Mouseout event - Revert to original color
          mouseout: (e) => {
            e.target.setStyle({ fillColor: originalColor });
          },
            click: (e) => {
                // console.log(feature.p);
                setSelectedArea(feature.properties.NAME);
            }
        });
    }

    const usaBounds = [
      [24.396308, -125.0],   // Southwest corner
      [49.384358, -66.93457] // Northeast corner
    ];


  return (
    <MapContainer center={[36, -92]} zoom={5} style={{ height: "89vh", zIndex: 1}} maxBounds={usaBounds} maxBoundsViscosity={0} minZoom={4.75}>
    <MapController selectedArea={selectedArea} mapView={mapView}/>
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

      {/* <M display={display} /> */}
      {mapView === 'State' && <GeoJSON key={display[0]} data={display[1]} onEachFeature={onEachFeature} />}
      {mapView === 'Congressional' && <CongressionalDistrictMap display={display}/>}
      {mapView === 'County' && <CountyMap display={display} />}
      {mapView === 'Precinct' && <PrecinctMap display={display} />}

    </MapContainer>
  );
};

const MapController = ( {selectedArea }) => {
  const map = useMap();

  console.log(map.getBounds());

  if(selectedArea === 'South Carolina') {
    // console.log("map", map.getCenter());
    map.flyTo([33.8176231,-78.2079802], 7.75, {
        animate: true,
        duration: 1,
    });
  } else if (selectedArea === 'Utah') {
    map.flyTo([39.7659401,-106.8108964], 7, {
        animate: true,
        duration: 1,
    });
  } else {
    map.flyTo([36, -92], 5, {
      animate: true,
      duration: 1,
    });
    // map.setMaxBounds(usaBounds);
  }
  return null;
};

export default StatesMap;
